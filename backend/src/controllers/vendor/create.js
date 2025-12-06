import Vendor from "../../models/Vendor.js"


const createVendor = async (req, res) => {
    try {
        const data = req.body
        const vendor = new Vendor(data)
        const vendorData = await vendor.save()
        res.status(201).json({ message: "Vendor created successfully " })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Vendor email already exists" });
        }

        res.status(400).json({ message: error.message });
    }
}

export default createVendor