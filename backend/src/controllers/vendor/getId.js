import Vendor from "../../models/Vendor.js"




const getVendorId = async ( req , res ) => {
    try {

        const { id } = req.params
        const vendorData = await Vendor.find({ _id : id })
        if ( vendorData.length === 0 ) {
            return res.status(404).json({ message : " Vendor not found "})
        }
        res.status(200).json({ message : "Success" , data : vendorData})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default getVendorId