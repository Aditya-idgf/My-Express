const User = require("../model/model.user");
const {v4 : uuidv4} = require('uuid')
const {setUser} = require('../service/auth')

async function handleUserSignup(req,res) {
    const {name, email, password} = req.body;
    
    // here since the name of the schema values and the properties of the body method are same therefore we can directly put them in the {} to create entry :
    // this is same as : 
    // await User.create({
    //     name: name,
    //     email: email,
    //     password: password,
    //  });
        
    await User.create({
        name, email, password,
    });
    return res.redirect('/');
}   

async function handleUserLogin(req,res) {
    const {email, password} = req.body;

    const user = await User.findOne({email, password});
    if (!user) return res.render('login', {
        error : 'Invalid Username Or Password'
    })

    const sessionId = uuidv4();
    setUser(sessionId, user);

    console.log("SESSION CREATED:", sessionId);

    res.cookie('uid', sessionId);
    return res.redirect('/');
}   

module.exports = {handleUserSignup, handleUserLogin}