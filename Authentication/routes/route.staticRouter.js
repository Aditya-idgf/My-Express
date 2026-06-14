const express = require('express');
const URL = require('../model/model.url');
const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.user) res.redirect('/login')
    const myURLS = await URL.find({createdBy : req.user._id});
    return res.render('home', {
        allurls : myURLS
    })
})

router.get('/signup', async (req, res) => {
    return res.render('signup')
})

router.get('/login', async (req, res) => {
    return res.render('login');
})

module.exports = router;