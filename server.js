const express = require('express');
const fs = require('fs')

const app = express()

app.use(express.urlencoded({ extended: false }));

app.get('/request-data', (req, res, next) => {
    res.json({message: 'Welcome to Miliya AI. To get started, may I know your name and phone number, please?'})
});

app.get('/on-failure', (req, res, next) => {
    res.json({message: 'We are unable to process your request at this time. Please try again later.'})
})

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

  const twiml = `
    <Response>
      <Say voice="alice">Thanks! Your details have been noted.</Say>
      <Hangup/>
    </Response>
  `;
  res.type('text/xml');
  res.send(twiml);
});


app.listen(5000, () => console.log('Server running on PORT: 5000'))