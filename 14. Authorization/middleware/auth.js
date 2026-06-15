const {getUser} = require('../service/auth')

// here since we want to access the pages we will rever them to how we dealt we with
function checkForAuthentication(req, res, next) {

    console.log('The request went through : checkForAuthentication');
    const authenticationToken = req.cookies?.uid;
    req.user = null;
    
    if (!authenticationToken) return next();
    
    const user = getUser(authenticationToken);
    
    req.user = user;
    
    return next();
}
// Authorization
function restrictTo(roles = []) {
    return (req, res, next) => {
        console.log('The request went through : restrictTo');
        if (!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)) return res.end('UnAuthorized')
        
        return next();
    }
}

// async function restrictToLoggedInUserOnly(req, res,next) {
//     const userUid = req.headers['authorization'];
//     if(!userUid) return res.redirect('/login');
//     const token = userUid.split('Bearer ')[1]; 
//     const user = getUser(token);
//     if(!user) return res.redirect('/login')
//     req.user = user;
//     next();
// }

// async function chechAuth(req, res , next) {
//     const userUid = req.headers['authorization'];
//     const token = userUid.split('Bearer ')[1]; 
//     const user = getUser(token);
//     req.user = user;
//     next();
// }

module.exports = {checkForAuthentication, restrictTo};