function checkType() {
    return (req , res, next)=>{
        console.log('SOME REQUEST WAS MADE : ', req.method, " Where Path was : ", req.url);
        next();
    }
}

module.exports = {checkType};