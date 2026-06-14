const express = require('express');
const router = express.Router();
router.use(express.urlencoded({extended:false}));
const {handleGetAllUsers, handleGetUserByID, handlePatchUserByID, handleDeleteUserByID, handleCreateUser} = require('../controllers/contoller.user')

// router.get('/users', async (req, res)=> {
//     const allDBUsers = await User.find();
//     const html = 
//     `<ul>
//         ${
//             allDBUsers.map((user)=>`
//                 <li>
//                     ${
//                         user.username 
//                     } : 
//                     ${
//                         user.email
//                     }
//                 </li>
//             `).join('')
//         }
//     </ul>`
//     res.send(html);
// }) 

router
.route('/')
.get(handleGetAllUsers)
.post(handleCreateUser)

router
.route('/:id')
.get(handleGetUserByID)
.patch(handlePatchUserByID)
.delete(handleDeleteUserByID)


module.exports = router;