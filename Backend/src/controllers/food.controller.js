const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const likeModel=require('../models/likes.model');
const saveModel=require('../models/save.model');
const commentModel=require('../models/comment.model');
const mongoose=require('mongoose');

async function createFood(req, res) {
// Upload image
const fileUploadResult = await storageService.uploadFile(
  req.file.buffer,
  uuid()
);



// Create and save food item
const foodItem = new foodModel({
  name: req.body.name,
  description: req.body.description,
  video: fileUploadResult.url,
  price: req.body.price,
  foodPartner: req.foodPartner._id
});

await foodItem.save();

res.status(201).json({
  message: "Food created successfully",
  foodItem: foodItem
});
}


async function getAllFoods(req,res){
  const foodItem=await foodModel.find();
  res.status(200).json({
    message:"Food items fetched successfully",
    foodItem,
  })
}

async function getFoodById(req,res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid Food ID" });
}
    const foodItem = await foodModel.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.status(200).json({
      message: "Food fetched successfully",
      foodItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching food",
      error: error.message,
    });
  }
}

async function getUpdateFood(req,res){
  try {
    const { foodId}=req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
  return res.status(400).json({ message: "Invalid Food ID" });
}
    const updatedFood=await foodModel.findByIdAndUpdate(foodId,{
      name:req.body.name,
      description:req.body.description,
      price:req.body.price,
    }
  ,{new:true});

  if(!updatedFood){
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({
      message:"Food updated successfully",
      updatedFood
    })
    
  }
  catch(err){
    res.status(500).json({ message:"Error updating food",error:err.message});
  }
}

async function getFoodDelete(req,res) {
  try {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const deletedFood = await foodModel.findByIdAndDelete(foodId);
    if (!deletedFood) {
      return res.status(404).json({ 
        success:false,
        message: "Food not found or unauthorized access" });
    }

    
    
    res.status(200).json({ success:true, message: "Food deleted successfully", deletedFood });
  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    res.status(500).json({ success:false, message: "Error deleting food", error: error.message });
  }
}




async function likeFood(req,res){
  const {foodId}=req.body;
  const user=req.user;
  try{
    const existingLike=await likeModel.findOne({
      user:user._id,
      foodItem:foodId
    })
    if(existingLike){
      await likeModel.deleteOne({ 
        user:user._id,
        foodItem:foodId
      });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
      return res.status(200).json({
        message:"Food unliked successfully"
      })
    }
    const like=new likeModel({
      user:user._id,
      foodItem:foodId
    })
    await like.save();
    await foodModel.findByIdAndUpdate(foodId,{ $inc:{ likeCount:1}});
    res.status(201).json({
      message:"Food liked successfully",
      like
    })
  }catch(error){
    res.status(500).json({
      message:"Error liking food",
      error:error.message
    })
  }
}

async function saveFood(req,res){
  
  try{
    const {foodId}=req.body;
    const user=req.user;
    const existingSave=await saveModel.findOne({
      user:user._id,
      foodItem:foodId
    })
    if(existingSave){
      await saveModel.deleteOne({ 
        user:user._id,
        foodItem:foodId
      });
      await foodModel.findByIdAndUpdate(foodId,{ $inc: { saveVideo:-1}});
      return res.status(200).json({
        message:"Food removed from saves successfully"
      })
    }
    const save=new saveModel({
      user:user._id,
      foodItem:foodId
    })
    await save.save();
    await foodModel.findByIdAndUpdate(foodId,{ $inc:{ saveVideo:1}});
    res.status(201).json({
      message:"Food saved successfully",
      save
    })
  }catch(error){
    res.status(500).json({
      message:"Error saving food",
      error:error.message
    })
  }
}

async function getSaveFood(req, res) {
  try {
    const user = req.user._id;
    

    const saveFoods = await saveModel
      .find({ user: user })
      .populate("foodItem"); 

    if (!saveFoods || saveFoods.length === 0) {
      return res.status(200).json({ message: "no saved foods found", saveFoods: [] });
    }

    res.status(200).json({
      message: "saved foods retrieved successfully",
      saveFoods
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
}
async function commentFood(req,res) {
  try{
    const {foodId,text}=req.body;
    const user=req.user;

    const comment=new commentModel({
      user:user._id,
      foodItem:foodId,
      text:text
    })
    await comment.save();
    await foodModel.findByIdAndUpdate(foodId,{ $inc:{ commentCount:1}});
    res.status(201).json({
      message:"Comment added successfully",
      comment
    })
  }catch(error){
    res.status(500).json({
      message:"Error adding comment",
      error:error.message
    })
  }
}

async function getcommentFood(req,res){
  try{
    const {foodId}=req.params;
    const comments=await commentModel.find({foodItem:foodId})
    .populate("user","name avatar")
    .sort({createdAt:-1});
    res.status(200).json({
      message:"Comments fetched successfully",
      comments
    })
  }catch(error){
    res.status(500).json({
      message:"Error fetching comments",
      error:error.message
    })
  }
}

module.exports = { createFood,getAllFoods,likeFood,saveFood,getSaveFood,commentFood,getcommentFood,getFoodDelete,getUpdateFood,getFoodById };