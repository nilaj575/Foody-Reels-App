const mongoose=require('mongoose');

const foodSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodPartner'
    },
    price:{
        type:Number,
        default:0
    },
    likeCount:{
        type:Number,
        default:0
    },
    saveVideo:{
        type:Number,
        default:0
    },
    commentCount:{
        type:Number,
        default:0
    }

})

const foodmodel=mongoose.model('Food',foodSchema);

module.exports=foodmodel;