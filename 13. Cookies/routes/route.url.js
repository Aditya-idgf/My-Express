const express = require('express');
const router = express.Router();
const {handleGenerateShortURL} = require('../controller/controller.url')

router
.post('/', handleGenerateShortURL);

module.exports = router;