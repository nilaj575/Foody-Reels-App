const mongoose = require("mongoose"); 
const foodPartnerModel=require('../models/foodPartner.model');
const foodModel=require('../models/food.model');
async function getFoodPartnerById(req,res){
    const foodPartnerId=req.params.id;
    try{
        const foodPartner=await foodPartnerModel.findById(foodPartnerId);
        const foodItems=await foodModel.find({foodPartner:foodPartnerId})
        if(!foodPartner){
            return res.status(404).json({
                message:"Food Partner not found"
            })
        }
        res.status(200).json({
            message:"Food Partner retrieved successfully",
            foodPartner:{
                ...foodPartner.toObject(),
                foodItems
            }
        });
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }

}


async function getOwnProfile(req, res) {
  try {
    const foodPartner = req.foodPartner;

    const foods = await foodModel.find({
      foodPartner: foodPartner._id
    });

    return res.status(200).json({
      success: true,
      foodPartner,
      foodItems: foods   // ✅ IMPORTANT
    });

  } catch (error) {
    console.error("OWN PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load profile"
    });
  }
};

async function getAllFoodPartners(req, res) {
  try {
    const foodPartners = await foodPartnerModel.find();
    res.status(200).json({
      success: true,
      foodPartners
    });
  } catch (error) {
    console.error("GET ALL FOOD PARTNERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load food partners"
    });
  }
}

module.exports={
    getFoodPartnerById,
    getOwnProfile,
    getAllFoodPartners
};