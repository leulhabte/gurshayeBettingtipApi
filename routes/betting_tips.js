const express = require('express');
const route = express.Router();
const { authAdmin } = require('../middleware/auth')
const { Betting_tip, insert_Prediction, validatePrediction, updaupdatePrediction, getLeagueStat, getInsertedAtStats } = require('../model/betting_tips');

route.post('/postTip', authAdmin, async (req, res) => {
    const { error } = validatePrediction(req.body);
    if (error) return res.status(400).json({ error: error.message })

    const { value, ex } = await insert_Prediction(req.body)
    if (ex) return res.status(500).json({ error: 'Something went wrong' })

    return res.status(201).json({ message: 'Betting Tip inserted', betting_tip: value })
})

route.get('/getPrediction', async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    const betting_tips = await Betting_tip.find().sort({inserted_At: -1}).skip((page - 1) * perPage).limit(perPage)
    const count = await Betting_tip.find().countDocuments()
    const total_pages = Math.ceil(count / perPage)
    return res.status(200).json({ total_data: count, total_pages, page, perPage, betting_tips })
})

route.post('/setCorrect', authAdmin, async (req, res) => {
    const set_correct = await Betting_tip.findById(req.query._id);
    if (!set_correct) return res.status(400).json({ error: 'Tip Not Found' })

    if (req.query.is !== "yes" && req.query.is !== 'no') return res.status(400).json({ error: 'Only "yes" or "no" is allowed' })

    set_correct.is_correct = req.query.is;
    const save = await set_correct.save();
    return res.status(200).json({ message: "Prediction Updated", betting_tip: save })
})

route.post('/remove', authAdmin, async (req, res) => {
    const remove_tip = await Betting_tip.deleteOne({ _id: req.query._id })
    if (remove_tip.deletedCount === 0) return res.status(400).json({ error: 'No prediction found' })
    return res.status(200).json({ message: 'prediction removed', removed_prediction: remove_tip })
})

route.post('/updatePrediction', async (req, res) => {
    const { error } = validatePrediction(req.body);
    if (error) return res.status(400).json({ error: 'Invalid Input Provided' })

    const { value, ex } = await updaupdatePrediction(req.query.id, req.body)
    if (value) return res.status(200).json({ message: 'Prediction Updated', update_tip: value })

    return res.status(400).json({ error: ex })
})

route.get('/getleagues', async (req, res) => {
    const {total, leagues} = await getLeagueStat();
    return res.status(200).json({
        Total: total,
        Leagues: leagues
    })
});

route.get('/insertedAtStat', async (req, res)=>{
    const {total, inserted_At} = await getInsertedAtStats();
    return res.status(200).json({
        Total: total,
        statistics: inserted_At
    })
});

route.get('/get_iscorrect', async (req, res)=>{
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const is = req.query.is;

    const un_marked = await Betting_tip.find({is_correct: is}).sort({inserted_At: -1}).skip((page - 1) * perPage).limit(perPage)
    const count = await Betting_tip.find({is_correct: is}).countDocuments()
    const total_pages = Math.ceil(count / perPage)
    return res.status(200).json({ total_data: count, total_pages, page, perPage, un_marked })
})

route.get('/get_count', async (req, res)=>{
    const is = req.query.is;
    if(is === 'total') {
        const count = await Betting_tip.find().countDocuments()
        return res.status(200).json({ total_data: count})
    }
    const count = await Betting_tip.find({is_correct: is}).countDocuments()
    return res.status(200).json({ total_data: count})
})

module.exports = route; 