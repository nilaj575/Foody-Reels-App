const express=require('express');
const app=express();
const cookieParser = require('cookie-parser');
const authRoutes=require('./routes/auth.routes');
const foodRoutes=require('./routes/food.routers');
const foodPartnerRoutes=require('./routes/food-partner.routes');
const orderRoutes=require('./routes/order.routes');
const paymentRoutes=require('./routes/payment.routes');
const partnerOrderRoutes = require('./routes/partnerOrder.routes');
const cors=require('cors');


app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin:'http://localhost:5173',credentials:true}));

app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("hello word");
})
app.use('/api/auth',authRoutes);
app.use('/api/food',foodRoutes);
app.use('/api/food-partner/orders', partnerOrderRoutes);
app.use('/api/food-partner',foodPartnerRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/payment',paymentRoutes);


module.exports=app;