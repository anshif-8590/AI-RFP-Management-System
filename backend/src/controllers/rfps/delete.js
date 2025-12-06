import Rfp from "../../models/Rfp.js"




const deleteRfp = async ( req , res ) => {
     try {
        const { id } = req.params
        const deletedRfp = await Rfp.findByIdAndDelete( id )
        if ( !deleteRfp ) {
            return res.status(404).json({ message : "RFP not found "})
        }
        res.status(200).json({ message : "RFP deleted successfully" , })
     } catch (error) {
        res.status(500).json({ message: error.message });
     }
}

export default deleteRfp 