const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/gurshaye', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('connected...'))
    .catch(err => { console.log(err) })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require('./routes/user');
const betting_tips = require('./routes/betting_tips');

app.use('/api/user/', user);
app.use('/api/betting_tips/', betting_tips);

app.use((error, req, res, next) => {
    res.status(500).json({
        error
    })
})

module.exports = app;