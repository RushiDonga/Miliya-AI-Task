const express = require('express');
const fs = require('fs')

const app = express()

app.use(express.urlencoded({ extended: false }));

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

app.post('/process-response', (req, res) => {
  const callerResponse = req.body.SpeechResult || 'No Speech Detected';
  console.log('Speech recognized:', callerResponse);

  fs.appendFileSync('call_log.txt', `Caller said: ${callerResponse}\n`);

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


app.listen(5000, () => console.log('Server running on PORT: 5000'))