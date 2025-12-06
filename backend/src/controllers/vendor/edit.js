import Vendor from "../../models/Vendor.js"


const editVendor = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const updatedVendorData = await Vendor.findByIdAndUpdate(id, data, { new: true })
        if (!updatedVendorData) {
            return res.status(404).json({ message: " Vendor not found " })
        }
        res.status(200).json({ message: "Success", newData: updatedVendorData })
    } catch (error) {
        res.status(500).json({ message: err.message });
    }


}

export default editVendor