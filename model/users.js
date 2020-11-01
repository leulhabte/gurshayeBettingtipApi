const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['Admin', 'Users']
    }
});

const User = mongoose.model('users', userSchema);

function validateLogin (user) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(4).required()
    })

    return schema.validate(user)
}

function validateChangeProfile (user) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(4).required(),
        new_password: Joi.string().min(4).required()
    })

    return schema.validate(user)
}

async function logUser (userInfo) {
    const user = await User.findOne({name: userInfo.name});

    if(!user) return {value: null, ex: 'User doesn\'t exsist'}
    
    const isMatched = await bcrypt.compare(userInfo.password, user.password);

    if(isMatched) return {value: user, ex: null}

    return {value: null, ex: 'Incorrect User name or password'}
}

async function changeProfile (params) {
    const user = await User.findOne({});
    
    if(!user) return {value: null, ex: 'User doesn\'t exsist'};

    const isMatched = await bcrypt.compare(params.password, user.password);

    if(isMatched){
        const genSalt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(params.new_password, genSalt);

        if(hash){
            user.name = params.name;
            user.password = hash;
    
            const save = await user.save();
    
            return {value: save, ex: null}
        }
    }

    return {value: null, ex: 'Incorrect Password'}
}

exports.validateLogin = validateLogin;
exports.validateChangeProfile = validateChangeProfile;
exports.User = User;
exports.changeProfile = changeProfile;
exports.logUser = logUser;