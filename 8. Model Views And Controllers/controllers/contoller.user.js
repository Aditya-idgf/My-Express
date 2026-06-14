const User = require('../models/model.user')

async function handleGetAllUsers(req, res) {
    const allUSERS = await User.find();
    return res.json(allUSERS);
}

async function handleGetUserByID(req, res) {
    const userData = await User.findById(req.params.id);

    if(!userData) return res.status(404).json({msg:"USER NOT FOUND"}); 
    return res.json(userData);
}

async function handlePatchUserByID(req, res) {
    const id = req.params.id;
    console.log("body: ", req.body);
    await User.findByIdAndUpdate(id, req.body)  
    
    return res.send({
        msg: `User : ${id} was updated successfully !`
    })
}

async function handleDeleteUserByID(req, res) {
    const userData = await User.findByIdAndDelete(req.params.id); 
    return res.json({
        msg: `User : ${id} was deleted successfully !`
    });
}

async function handleCreateUser(req, res) {   
    const body = req.body;
    const result = await User.create({
        username: body.username,
        password: body.password,
        email: body.email,
        jobTitle: body.job,
        gender: body.gender
    })

    console.log('RESULT : ', result)

    return res.status(201).json({
        msg: 'USER ADDED SUCCESSFULLY'
    })
}

module.exports = {
    handleGetAllUsers,
    handleGetUserByID,
    handlePatchUserByID, 
    handleDeleteUserByID,
    handleCreateUser
}