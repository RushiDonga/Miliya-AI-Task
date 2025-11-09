const express = require('express');
const fs = require('fs')
const axios = require('axios')

const app = express()

// ENV VARIABLES
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));

// APIs
app.post('/incoming-call', (req, res) => {
    const reply = `
    <Response>
      <Say voice="alice">Welcome to Miliya AI. To get started, may I know your name and phone number, please?</Say>
      <Gather input="speech" action="/process-response" method="POST" timeout="5"/>
    </Response>
    `;
    res.type('text/xml');
    res.send(reply);
});

app.post('/process-response', async (req, res) => {
  const callerResponse = req.body.SpeechResult || 'No Speech Detected';

  const structuredData = await getStructuredDataFromOpenAI(callerResponse);

  if(structuredData){
    fs.writeFileSync('call_log.txt', structuredData + '\n', 'utf8');
    console.log('Structured data saved to call_log.txt');
  }else{
    console.log('No structured data received from OpenAI');
  }

  const twiml = `
    <Response>
      <Say voice="alice">Thanks! Your details have been noted.</Say>
      <Hangup/>
    </Response>
  `;
  res.type('text/xml');
  res.send(twiml);
});

app.get('/get-calls', (req, res) => {
    try {
        if (!fs.existsSync('call_log.txt')) {
        return res.json({ message: 'No call data found.' });
        }

        const data = fs.readFileSync('call_log.txt', 'utf8');
        res.json({ calls: data.split('\n').filter(line => line.trim() !== '') });
  } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read call log.' });
  }
})

// REQUIRED FUNCTIONS
async function getStructuredDataFromOpenAI(callerResponse) {
  try {
    const prompt = `
      Extract the name and phone number from this text and format exactly like:
      Name: <name>
      Phone: <phone number>
      
      Text: "${callerResponse}"
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/responses',
      {
        model: 'gpt-4.1',
        input: prompt
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extract text from response
    const output = response.data?.output?.[0]?.content?.[0]?.text;
    return output;

  } catch (err) {
    console.error("Error calling OpenAI API:", err.message);
    return null;
  }
}

// START THE APP
app.listen(5000, () => console.log('Server running on PORT: 5000'))