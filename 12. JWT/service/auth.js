const jwt = require('jsonwebtoken');

const sessionIdToUserMap = new Map();
const secret = 'password';

function setUser(user) {

    // sessionIdToUserMap.set(id, user);

    return jwt.sign({
        _id: user._id,
        email: user.email
    }, secret)
}

function getUser(token) {
    if(!token) return null;

    // return sessionIdToUserMap.get(id);
    
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log("SOME ERROR OCCURED : ", error);
        return null;
    }
}

module.exports = { setUser, getUser };