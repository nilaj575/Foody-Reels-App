const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
    },
    contact:{
        type:String,
        required:true
    },
    isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
},
 {
        timestamps:true
    }
)
const Usermodel=mongoose.model('User',userSchema);

module.exports=Usermodel;