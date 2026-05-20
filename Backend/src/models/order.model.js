const mongoose=require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodPartner',
    required: true,
  },
  items: [
    {
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
      name:{
        type:String
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    enum:['pending','confirmed','preparing','ready','delivered','cancelled'],
    default:'pending'
  },
  paymentMethod:{
    type:String,
    enum:['cash','card','online'],
    default:'cash'
  },
  paymentStatus:{
    type:String,
    enum:['pending','paid','failed'],
    default:'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);