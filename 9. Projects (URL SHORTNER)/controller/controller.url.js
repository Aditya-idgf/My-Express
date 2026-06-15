const {nanoid, urlAlphabet} = require('nanoid')
const URL = require('../model/model.url')

async function handleGenerateShortURL(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({msg:'URL IS REQUIRED'}); 

    const id = nanoid(8);
    console.log("NANOID : ", id);
    
    await URL.create({

        shortID: id,
        redirectURL: body.url,
        visitHistory: [],
    })
    
    return res.json({
        msg: "URL Generated Successfully",
        id: id
    })
}

module.exports = {handleGenerateShortURL}; 