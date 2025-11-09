const express = require('express');

const app = express()

app.get('/request-data', (req, res, next) => {
    res.json({message: 'Welcome to Miliya AI. To get started, may I know your name and phone number, please?'})
});

app.get('/on-failure', (req, res, next) => {
    res.json({message: 'We are unable to process your request at this time. Please try again later.'})
})

app.listen(5000, () => console.log('Server running on PORT: 5000'))