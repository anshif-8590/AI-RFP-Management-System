import Rfp from "../../models/Rfp.js";



const getRfpsId = async (req, res) => {
    try {
        const { id } = req.params
        console.log("GET /rfps/:id called with id:", id);

        const rfp = await Rfp.findById(id)
        console.log("Found RFP:", rfp?._id);

        if (!rfp) {
            return res.status(404).json({ message: "RFP not found " })
        }
        res.status(200).json({ message: "Success", rfp })

    } catch (error) {
        console.error("GET /rfps/:id error:", error);
        res.status(500).json({ message: error.message });
    }
}

export default getRfpsId