import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        rfpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rfp",
            required: true
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendor",
            required: true
        },
        rawEmail: {
            type: String,
            required: true
        },
        parseFields: {
            type: Object
        },
        price: {
            type: Number
        },
        terms: {
            type: String
        },
        attachments: [
            {
                fileName: String,
                fileUrl: String
            }
        ],
        score: {
            type: Number
        },
        fromEmail: {
            type: String
        },
        subject: {
            type: String
        }


    },
    {
        timestamps: true
    }
)

proposalSchema.index({ rfpId: 1 })

const Proposal = mongoose.model("Proposal", proposalSchema)
export default Proposal 