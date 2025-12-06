import { json } from "express";
import Rfp from "../../models/Rfp.js";



const getRfpsId = async ( req , res ) => {
    try {
        const { id } = req.params
        const rfp = await Rfp.find({ _id : id })
        console.log(rfp.length)
        if ( rfp.length === 0) {
            return res.status(404).json({ message : "RFP not found "})
        }
        res.status(500).json({ message : "Success" , rfp })
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export default getRfpsId