const User = require("../model/model.user");
const {v4 : uuidv4} = require('uuid')
const {setUser} = require('../service/auth')

async function handleUserSignup(req,res) {
    const {name, email, password} = req.body;   
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

    const token = setUser(user);

    console.log("SESSION CREATED [JWT] :", token);

    // res.cookie('uid', token, {
    //     domain: 'https://www.google.com/'
    // });
    // return res.redirect('/');

    res.json({ token });
}   

module.exports = {handleUserSignup, handleUserLogin}