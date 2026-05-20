const express=require('express');
const foodPartnerController=require('../controllers/food-partner.controller');
const authMiddleware=require('../middleware/auth.middleware');

const router=express.Router();
router.get("/all", foodPartnerController.getAllFoodPartners);
/* /api/food-partner/:id */
router.get('/own',authMiddleware.authFoodPartnerMiddleware,foodPartnerController.getOwnProfile);

router.get('/:id',authMiddleware.authuserMiddleware
    ,foodPartnerController.getFoodPartnerById
)



module.exports = router;
console.log(
  typeof authMiddleware.authuserMiddleware,
  typeof foodPartnerController.getOwnProfile
);


module.exports=router;