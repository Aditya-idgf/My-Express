const { get } = require('mongoose');
const {getUser} = require('../service/auth')

async function restrictToLoggedInUserOnly(req, res,next) {

    const userUid = req.cookies?.uid; // this way it will only work if there is a cookie
    console.log("[restrictToLoggedInUserOnly] COOKIE UID:", userUid);

    if(!userUid) return res.redirect('/login');

    const user = getUser(userUid);
    console.log("[restrictToLoggedInUserOnly] USER:", user);
    if(!user) return res.redirect('/login')
    
    req.user = user;
    next();
}

async function chechAuth(req, res , next) {
    const userUid = req.cookies?.uid; // this way it will only work if there is a cookie
    console.log("[chechAuth] COOKIE UID:", userUid);

    const user = getUser(userUid);
    console.log("[chechAuth] USER:", user);
    
    req.user = user;
    next();
}

module.exports = {restrictToLoggedInUserOnly, chechAuth};