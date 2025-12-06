import Vendor from "../../models/Vendor.js"



const getVendor = async ( req , res ) => {

    try {
        const allVendorData = await Vendor.find()
        if ( allVendorData.length === 0 ){
            return res.status(400).json({ message : " No vendors data availabel "})
        }
        res.status(200).json({ message : "Success" , Data : allVendorData })
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }


}

export default getVendor