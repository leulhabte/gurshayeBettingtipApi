const mongoose = require('mongoose');
const Joi = require('joi');

const bettingTipsSchema = mongoose.Schema({
    league: {
        type: String,
        required: true
    },
    team_1: {
        type: String,
        required: true
    },
    team_2: {
        type: String,
        required: true
    },
    match_time: {
        type: String,
        required: true
    },
    match_date: {
        type: String,
        required: true
    },
    match_prediction: {
        type: String,
        enum: ['1', '1x', '2', '2x', 'Over 2.5', 'Under 2.5', 'BTTS'],
        required: true,
    },
    is_correct: {
        type: String,
        required: true,
        default: 'N/A'
    },
    inserted_At: {
        type: Date,
        default: Date.now
    },
});

const Betting_tip = mongoose.model('betting_tips', bettingTipsSchema);

function validatePrediction(params) {
    const schema = Joi.object({
        league: Joi.string().required(),
        team_1: Joi.string().required(),
        team_2: Joi.string().required(),
        match_time: Joi.string().required(),
        match_date: Joi.string().required(),
        match_prediction: Joi.string().valid('1', '1x', '2', '2x', 'Over 2.5', 'Under 2.5', 'BTTS').required(),
    })

    return schema.validate(params)
}

async function updatePrediction(id, params) {
    try {
        const prediction = await Betting_tip.findById(id);

        prediction.league = params.league
        prediction.team_1 = params.team_1
        prediction.team_2 = params.team_2
        prediction.match_time = params.match_time
        prediction.match_date = params.match_date
        prediction.match_prediction = params.match_prediction

        const update = await prediction.save();

        return { value: update, ex: null }
    } catch (error) {
        return { value: null, ex: error.message }
    }

}

async function insert_Prediction(params) {
    const save = await Betting_tip(params).save();
    return { value: save, ex: null }
}

async function getLeagueStat() {
    const getLeague = await Betting_tip.find({});
    const leagues = [], temporary_arr = [], total_information = [];
    var temporary, count = 1;
    getLeague.map(data => {
        leagues.push(data.league)
    });
    for (var i = 0; i < leagues.length; i++) {
        if (leagues[i] != 'A') {
            temporary = leagues[i];
            temporary_arr.push(temporary);
        } else {
            continue;
        }
        for (var j = i + 1; j < leagues.length; j++) {
            if (temporary == leagues[j]) {
                count++;
                leagues[j] = 'A'
            }
        }
        total_information.push({
            name: temporary_arr[0],
            count: count
        });
        count = 1;
        temporary_arr.pop();

    }
    return { total: getLeague.length, leagues: total_information }
}

async function getInsertedAtStats() {
    over_all_info = await Betting_tip.find({});
    const insertedAt = [], temporary_arr = [], total_information = [];
    var temporary, count = 1;
    over_all_info.map(data => {
        insertedAt.push(data.inserted_At)
    });
    for (var i = 0; i < insertedAt.length; i++) {
        if (insertedAt[i] != 'A') {
            var temporary = `'${insertedAt[i]}'`.slice(1, 10);
            temporary_arr.push(temporary);
        } else {
            continue;
        }
        for (var j = i + 1; j < insertedAt.length; j++) {
            const date = `'${insertedAt[j]}'`.slice(1, 10)
            if (temporary == date) {
                count++;
                insertedAt[j] = 'A'
            }
        }
        total_information.push({
            name: temporary_arr[0],
            count: count
        });
        count = 1;
        temporary_arr.pop();

    }
    return { total: over_all_info.length, inserted_At: total_information }
}

exports.Betting_tip = Betting_tip;
exports.validatePrediction = validatePrediction;
exports.insert_Prediction = insert_Prediction;
exports.updaupdatePrediction = updatePrediction;
exports.getLeagueStat = getLeagueStat;
exports.getInsertedAtStats = getInsertedAtStats;