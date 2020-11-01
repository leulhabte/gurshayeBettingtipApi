const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const user = require('./routes/user');
const betting_tips = require('./routes/betting_tips');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(`mongodb+srv://leulhabte:${process.env.MongoSecret}@cluster0.saiuw.mongodb.net/gurshaye?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('connected...'))
    .catch(err => {console.log(err.message)})

const app = express();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/api/user', user);
app.use('/api/betting_tips', betting_tips);

app.use((error, req, res, next)=>{
    res.status(500).json({error: error.message});
})

module.exports = app;