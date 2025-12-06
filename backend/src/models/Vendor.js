import mongoose  from "mongoose";

const vendorSchema = new mongoose.Schema(
    {
        name : {
            type : String ,
            required : true  
        },
        email : {
            type : String ,
            required : true ,
            unique : true 
        },
        contactPerson : {
            type :String 
        },
        notes : {
            type : String 
        }
    },
    {
        timestamps : true 
    }
)

vendorSchema.index ({ email : 1 } , { unique : 1 })

const Vendor = mongoose.model( "vendor" , vendorSchema)

export default Vendor