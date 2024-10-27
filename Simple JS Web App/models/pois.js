const mongoose= require("mongoose")

const poisSchema= new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique: true,
    },

    category: {
        type: String,
        required:true,
    },
    address: {
        type: String,
        required: true,
        
    }
})

module.exports= mongoose.model("pois", poisSchema)