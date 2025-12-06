import mongoose from "mongoose"

const rfpSchema = new mongoose.Schema(
    {
        title : {
            type : String ,
            required : true
        },
        description : {
            type : String,
            required : true 
        },
        budget : {
            type : Number 
        },
        itmes : [
            {
                type : String 
            }
        ],
        deliveryData : {
            type : Date ,
        },
        paymentTerms : {
            type : String 
        },
        sentTo : [
            {
                vendorId : { type : mongoose.Schema.Types.ObjectId , ref : "vendor" },
                sentAt : { type : Date }
            }
        ]
    },
    {
        timestamps : true 
    }

)
const Rfp =  mongoose.model( "Rfp" , rfpSchema)
export default Rfp