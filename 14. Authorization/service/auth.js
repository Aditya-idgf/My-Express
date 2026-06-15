const jwt = require('jsonwebtoken');

const sessionIdToUserMap = new Map();
const secret = 'password';

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email, 
        role: user.role
    }, secret)
}

function getUser(token) {
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log("SOME ERROR OCCURED : ", error);
        return null;
    }
}

module.exports = { setUser, getUser };