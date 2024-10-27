const mongoose= require("mongoose")

const usersSchema= new mongoose.Schema({
    name:{ 
        type: String,
        required:true,
    },
    age: {
        type:Number,
        max:100,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    }
})


module.exports= mongoose.model("users", usersSchema)