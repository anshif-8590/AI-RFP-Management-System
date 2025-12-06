import Rfp from "../../models/Rfp.js";



const getRfps = async ( req , res ) => {
    try {
        const rfpsData = await Rfp.find()
        console.log(rfpsData,"data")
        res.status(200).json({ message : "Success" , rfpsData })
        
    } catch (error) {
       res.status(500).json({ message : error.message })
    }
}

export default getRfps