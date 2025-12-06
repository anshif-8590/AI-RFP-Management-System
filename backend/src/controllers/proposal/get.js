import Proposal from "../../models/Proposal.js";




const getAllProposal  = async ( req , res ) => {
    try {
        const proposals = await Proposal.find()
        .populate("rfpId")
        .populate("vendorId")
        
        res.json({ message : "Success" , proposals})
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export default getAllProposal