const Pois = require("../models/pois");


exports.poisList= async (req,res,next)=>{
    let pois;
    try{
        pois= await Pois.find()
        return res.status(200).json({pois});
     } 
     catch (err){
         return res.status(500).json({message: err.message});
     }
 
 };

exports.getPoi = async (req, res, next) => {
    const id = req.params.id;

    try {
        const poi = await Pois.findOne({ _id: id }, "name category address");

        if (poi) {
            return res.status(200).json({ poi });
        } else {
            return res.status(404).json({ message: "Point of Interest not found" });
        }
    } catch (err) {
        console.error("Error in getPoi:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

 exports.poiNew= async (req,res,next)=>{
    const { name, category, address}= req.body;
    if (!name || !category || !address) {
        return res.status(422).json({ message: "Your inputs are invalid" });
    }

    try {
             
        const newPoi = new Pois({ name, category, address });
        await newPoi.save();

        return res.status(201).json(newPoi);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
 
exports.poiUpdate = async (req, res, next) => {
    const { name, category, address } = req.body;
    const id = req.params.id;

    try {
        // Check if a POI with the provided ID exists
        const existingPoi = await Pois.findById(id);

        if (existingPoi) {
            // Update the existing POI properties
            existingPoi.name = name;
            existingPoi.category = category;
            existingPoi.address = address;

            // Save the updated POI to the database
            await existingPoi.save();

            return res.status(200).json(existingPoi);
        } else {
            return res.status(404).json({ message: "Point of Interest with this ID does not exist" });
        }
    } catch (err) {
        console.error("Error in poiUpdate:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deletePoi = async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Pois.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({ message: `Point of Interest with ID ${id} deleted successfully` });
        } else {
            return res.status(404).json({ message: 'Point of Interest not found' });
        }
    } catch (err) {
        console.error("Error in deletePoi:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



