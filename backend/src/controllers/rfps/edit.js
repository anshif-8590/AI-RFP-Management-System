
import Rfp from "../../models/Rfp.js"


const editRfp = async ( req , res ) => {
    try {
        const { id } = req.params
        const data = req.body
        const updatedRfp = await Rfp.findByIdAndUpdate( id , data , { new : true })
        if (!updatedRfp) {
           return res.status(404).json({ message : "RFP not found "})
        }
        res.status(200).json({ message : "RFP edited successfully " , updatedRfp })
    } catch (error) {
         res.status(500).json({ message: error.message });
        
    }
}

export default editRfp