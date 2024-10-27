const Users = require("../models/users");


exports.userList= async (req,res,next)=>{
    let users;
    try{
        users= await Users.find()
        return res.status(200).json({users});
     } 
     catch (err){
         return res.status(500).json({message: err.message});
     }
 
 };

 exports.getUser= async (req,res,next)=>{
    const userEmail=req.params.email;
    let user;
    try{
        user= await Users.findOne({email: userEmail},"name")
        return res.status(200).json({user});
     } 
     catch (err){
         return res.status(404).json({message: "User not found"});
     }
 
 };

 exports.userNew= async (req,res,next)=>{
    const { name, age, email}= req.body;
    if (!name || !email || !age) {
        return res.status(422).json({ message: "Your inputs are invalid" });
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // If the email is unique, save the new user
        const newUser = new Users({ name, age, email });
        await newUser.save();

        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
 
exports.userUpdate= async (req,res,next)=>{
    const { name, age,new_email}= req.body;
    const email= req.params.email;

    try {
        // Check if a user with the same email already exists
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            existingUser.name=name
            existingUser.age=age
            existingUser.email=new_email
            await existingUser.save();
            return res.status(200).json(existingUser);
        }else{
            return res.status(404).json({ message: "User with this email does not exist" });

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


exports.deleteUser= async (req,res,next)=>{
    const userEmail=req.params.email;
    let result;
    try {
        const result = await Users.findOneAndDelete({ email: userEmail });

        if (result) {
            return res.status(200).json({ message: `User with email ${userEmail} deleted successfully` });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
 
 };

 
 exports.checkAge = async (req, res, next) => {
    const { age } = req.body; 
    if (!age || isNaN(age)) {
        return res.status(422).json({ message: "Invalid age provided" });
    }
    try {
        if (age < 18) {
            return res.status(409).json({ message: "You are not old enough to sign up" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
};
