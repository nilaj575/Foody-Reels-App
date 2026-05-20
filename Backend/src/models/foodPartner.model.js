const mongoose=require('mongoose');

const foodPartnerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true

    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,

})

const foodPartnermodel=mongoose.model('FoodPartner',foodPartnerSchema);

module.exports=foodPartnermodel;