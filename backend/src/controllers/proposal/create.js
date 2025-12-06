import Proposal from "../../models/Proposal.js"



const createProposal = async ( req , res ) => {
    try {
       const { rfpId , vendorId , rawEmail } = req.body

       const proposal = new Proposal ({ rfpId , vendorId , rawEmail })
       await proposal.save()
       res.status(200).json({ message : "Proposal created successfully " , proposal })
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export default createProposal
