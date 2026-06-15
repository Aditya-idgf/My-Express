const express = require('express');
const URL = require('../model/model.url');
const router = express.Router();

router.get('/', async (req, res) => {
    const allURL = await URL.find();
    console.log(allURL)
    return res.render('home', {
        allurls : allURL
    })
})

module.exports = router;