import Proposal from "../../models/Proposal.js";




const getProposalById = async ( req , res ) => {
    try {
        const { id } = req.params
        const proposal = await Proposal.findById( id )
        .populate("rfpId")
        .populate("vendorId")
        console.log(proposal,"data")

        if ( !proposal ) {
            return res.status(404).json ({ message : "Proposal not found"})
        }
        res.json({ message : "Success" , proposal })

        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export default getProposalById