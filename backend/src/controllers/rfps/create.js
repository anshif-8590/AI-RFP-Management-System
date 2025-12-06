import Rfp from "../../models/Rfp.js"





const createRfps = async ( req , res ) => {
    console.log(req.body)
    const { title , description , budget , items , deliveryDate , paymentTerms } = req.body 
    
    if ( !title || !description ) {
        return res.status(400).json ({ message : "Title and description are required "})
    }
    const rfpData = new Rfp({
        title , description , budget , items , deliveryDate , paymentTerms
    })

    try {
        const finalRfpData = await rfpData.save()
        res.status(200).json ({ message : "Success" , finalRfpData })
    } catch (error) {
        res.status(500).json({ message : error.message })
    }

}

export default  createRfps