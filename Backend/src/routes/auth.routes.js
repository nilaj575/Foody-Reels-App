const express=require('express');
const router=express.Router();
const arthController=require('../controllers/auth.controller');
const verifiedController=require('../controllers/verify.controller');

//route for verifying user otp
router.post("/user/register", arthController.registerUser);
router.post("/user/verify-otp", verifiedController.verifyUserOTP);

router.post(
  "/food-partner/verify-otp",
  verifiedController.verifyFoodPartnerOTP
);


//sample route for authentication of user
router.post('/user/register',arthController.registerUser)
router.post('/user/login',arthController.loginUser)
router.post('/user/logout',arthController.logoutUser)

//router for food partner authentication
router.post('/food-partner/register',arthController.registerFoodPartner);
router.post('/food-partner/login',arthController.loginFoodPartner);
router.post('/food-partner/logout',arthController.logoutFoodPartner);

module.exports=router;