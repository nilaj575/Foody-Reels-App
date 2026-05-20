const router=require('express').Router();
const order=require('../controllers/order.controller');
const  authMiddleware=require('../middleware/auth.middleware');

router.post('/',authMiddleware.authuserMiddleware,order.createOrder);
router.get("/user-orders", authMiddleware.authuserMiddleware, order.getUserOrders);
module.exports=router;