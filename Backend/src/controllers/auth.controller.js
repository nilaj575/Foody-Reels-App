const Usermodel=require('../models/user.model');
const foodPartnermodel=require('../models/foodPartner.model');
const {generateOTP,hashOTP}=require('../utils/otp');
const {sendOTP}=require('../services/email.service');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { path } = require('../app');

//controller for user registation
async function registerUser(req,res) {
    try{
        const {name,email,password,contact}=req.body;

        if (!name || !email || !password || !contact) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

    const isUserExist=await Usermodel.findOne({email});
    if(isUserExist){
        return res.status(400).json({
            message:"user already exists"
        })
        
    }

    const otp=generateOTP();
    const hashedOTP=await hashOTP(otp);


    const hashPassword=await bcrypt.hash(password,10);
    const user= await  Usermodel.create({
        name,
        email,
        password:hashPassword,
        contact,
        otp: hashedOTP,
        otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
    })

    await sendOTP(email,otp);

    const token=jwt.sign({
        id:user._id,
    },process.env.jwt_secret);
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
});

    res.status(201).json({
        message:"OTP sent to email. Please verify your account",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            contact:user.contact
        }
    })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            error:err.message
        })
    }
}

async function loginUser(req,res){
    const {email,password}=req.body;

    const user=await Usermodel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"Invalid email"
        })
    }
    
    
    const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            })
            
        }
        const token=jwt.sign({
        id:user._id,
    },process.env.jwt_secret);
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
});


        res.status(200).json({
            message:"user logged in successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                contact:user.contact
            }
        })

}
function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"user logged out successfully"
    })
}

async function registerFoodPartner(req,res) {
    try{
        const {name,contactName,email,password,phone,address}=req.body ||{};
        if (!name || !contactName || !email || !password || !phone || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    const isAccountExist=await foodPartnermodel.findOne({email});
    if(isAccountExist){
        return res.status(400).json({
            message:"Account already exists"
        })
    }

    const otp=generateOTP();
    const hashedOTP=await hashOTP(otp);

    const hashPassword=await bcrypt.hash(password,10);
    const foodPartner= await foodPartnermodel.create({
        name,
        email,
        password:hashPassword,
        phone,
        address,
        contactName,
        otp:  hashedOTP,
        otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
        isVerified:false,
    })

    await sendOTP(email,otp);


    const token=jwt.sign({
        id:foodPartner._id,
    },process.env.jwt_secret);
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
});

    res.status(201).json({
        message:"OTP sent to email. Please verify your account.",
        foodPartner:{
            id:foodPartner._id,
            name:foodPartner.name,
            email:foodPartner.email,
            phone:foodPartner.phone,
            address:foodPartner.address,
            contactName:foodPartner.contactName


        }
    })
    } catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            error:err.message
        })
    }
    
}
async function loginFoodPartner(req,res) {
    const {email,password}=req.body;

    const foodPartner=await foodPartnermodel.findOne({email});

    if(!foodPartner){
        return res.status(400).json({
            message:"Invalid email"
        })
    }

    const isPasswordMatch=await bcrypt.compare(password,foodPartner.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            })

        }
        const token=jwt.sign({
        id:foodPartner._id,
    },process.env.jwt_secret,
    { expiresIn: "7d" }
);
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("foodPartnerToken",token,{
  httpOnly: true,
  sameSite: "lax",
  secure: false,
   maxAge: 7 * 24 * 60 * 60 * 1000, 
});


        res.status(200).json({
            message:"Food Partner logged in successfully",
            foodPartner:{
                _id:foodPartner._id,
                name:foodPartner.name,
                email:foodPartner.email
            }
        })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"Food partner logged out successfully"
    })    
}

module.exports={registerUser,loginUser,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner};