import Proposal from "../../models/Proposal.js";




const deleteProposal  = async ( req , res ) => {
    try {
        const { id } = req.params
        await Proposal.findByIdAndDelete( id )
        res.json({ message : "Proposal deleted "})
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export default deleteProposal