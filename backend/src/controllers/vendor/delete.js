import Vendor from "../../models/Vendor.js"



const deleteVendor = async ( req , res ) => {
    try {
        const { id } = req.params
        const vendorData = await Vendor.findByIdAndDelete( id )
         if ( !vendorData ) {
            return res.status(404).json({ message : "Vendor  not found "})
        }
        res.status(200).json({ message : "Vendor deleted successfully" , })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default deleteVendor