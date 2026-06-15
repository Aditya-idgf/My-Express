const { get } = require('mongoose');
const {getUser} = require('../service/auth')

async function restrictToLoggedInUserOnly(req, res,next) {

    // const userUid = req.cookies?.uid; 
    // console.log("[restrictToLoggedInUserOnly] COOKIE UID:", userUid);

    const userUid = req.headers['authorization'];
    if(!userUid) return res.redirect('/login');

    const token = userUid.split('Bearer ')[1]; 
    const user = getUser(token);

    // const user = getUser(userUid);
    // console.log("[restrictToLoggedInUserOnly] USER:", user);
    
    if(!user) return res.redirect('/login')
    
    req.user = user;
    next();
}

async function chechAuth(req, res , next) {
    // const userUid = req.cookies?.uid; 
    // console.log("[chechAuth] COOKIE UID:", userUid);
    console.log(req.headers)
    const userUid = req.headers['authorization'];
    console.log(userUid)
    // const user = getUser(userUid);
    // console.log("[chechAuth] USER:", user);
    const token = userUid.split('Bearer ')[1]; 
    const user = getUser(token);
    
    req.user = user;
    next();
}

module.exports = {restrictToLoggedInUserOnly, chechAuth};