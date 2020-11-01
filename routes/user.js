const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {validateChangeProfile, validateLogin, User, changeProfile, logUser} = require('../model/users');

dotenv.config();

route.post('/sign', async (req, res)=>{
    const pass = req.body.password;

    gensalt = await bcrypt.genSalt(10);
    hash = await bcrypt.hash(pass, gensalt);
    
    if(hash){
        const new_user = {...req.body, password: hash}

        const sign = await User(new_user).save();

        return res.status(201).json({message: 'Signed', user: sign})
    }

    return res.status(400),json({error: 'Error sign up'})
})

route.post('/login', async (req, res)=>{
    const {error} = validateLogin(req.body)
    if(error) return res.status(400).json({error: error.message})

    const {value, ex} = await logUser(req.body)
    if(ex) return res.status(401).json({error: ex})

    const token = jwt.sign({name: value.name, id: value._id, role: value.role}, process.env.TokenSecret)
    return res.status(200).json({message: 'Logged', token, profile: {Name: value.name, role: value.role}})
})

route.post('/changeProfile', async (req, res)=>{
    const {error} = validateChangeProfile(req.body)
    if(error) return res.status(400).json({error: error.message})

    const {value, ex} = await changeProfile(req.body)
    if(ex) return res.status(400).json({error: ex})

    console.log(value)
    const token = jwt.sign({name: value.name, id: value._id, role: value.role}, process.env.TokenSecret)
    return res.status(200).json({message: 'Profile updated', token, profile: {Name: value.name, role: value.role}})
})

module.exports = route