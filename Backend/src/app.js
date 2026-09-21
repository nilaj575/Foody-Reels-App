const express=require('express');
const path = require("path");
const app=express();
const cookieParser = require('cookie-parser');
const authRoutes=require('./routes/auth.routes');
const foodRoutes=require('./routes/food.routers');
const foodPartnerRoutes=require('./routes/food-partner.routes');
const orderRoutes=require('./routes/order.routes');
const paymentRoutes=require('./routes/payment.routes');
const partnerOrderRoutes = require('./routes/partnerOrder.routes');
const cors=require('cors');


const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: frontendUrl, credentials: true }));

app.use(express.urlencoded({ extended: true }));


app.use('/api/auth',authRoutes);
app.use('/api/food',foodRoutes);
app.use('/api/food-partner/orders', partnerOrderRoutes);
app.use('/api/food-partner',foodPartnerRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/payment',paymentRoutes);

const frontendPath = path.join(__dirname, "../../Frontend/dist");

app.use(express.static(frontendPath));

app.use((req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/socket.io/")) {
        return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports=app;