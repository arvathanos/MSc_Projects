const express= require("express");
const router= express.Router();

const { userList, userNew, checkAge, getUser, userUpdate, deleteUser } = require("../controllers/user-controller");


//Getting all users
router.get('/all',userList)
    

//Getting one user
router.get('/get-user/:email',getUser )

//Creating one user
router.post('/new-user',checkAge,userNew )

//Update a user
router.patch('/update-user/:email',checkAge,userUpdate)

//Delete a user
router.delete('/delete-user/:email',deleteUser)

module.exports=router