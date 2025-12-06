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
        attachments: [
            {
                fileName: String,
                fileUrl: String
            }
        ],
        score : {
            type : Number 
        }


    },
    {
        timestamps : true 
    }
)

proposalSchema.index ({ rfpId : 1 })

const Proposal = mongoose.model( "Proposal" , proposalSchema )
export default Proposal 