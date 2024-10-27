const express= require("express");
const router= express.Router();

const { deletePoi, poiUpdate, poiNew, getPoi, poisList } = require("../controllers/poi-controller");


//Getting all pois
router.get('/all',poisList)
    

//Getting one poi
router.get('/get-poi/:id',getPoi )

//Creating one poi
router.post('/new-poi',poiNew )

//Update a poi
router.patch('/update-poi/:id',poiUpdate)

//Delete a poi
router.delete('/delete-poi/:id',deletePoi)

module.exports=router