const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

/* CREATE FOOD */
router.post(
  '/',
  authMiddleware.authFoodPartnerMiddleware,
  upload.single('video'),
  foodController.createFood
);

/* USER ROUTES */
router.get('/', authMiddleware.authuserMiddleware, foodController.getAllFoods);

router.post('/like', authMiddleware.authuserMiddleware, foodController.likeFood);

router.post('/save', authMiddleware.authuserMiddleware, foodController.saveFood);

router.get('/save', authMiddleware.authuserMiddleware, foodController.getSaveFood);

router.post('/comment', authMiddleware.authuserMiddleware, foodController.commentFood);

router.get('/comment/:foodId', authMiddleware.authuserMiddleware, foodController.getcommentFood);

/* FOOD PARTNER ROUTES */
router.put('/update/:foodId', authMiddleware.authFoodPartnerMiddleware, foodController.getUpdateFood);

router.delete('/:foodId', authMiddleware.authFoodPartnerMiddleware, foodController.getFoodDelete);

/* KEEP THIS LAST */
router.get('/:id', authMiddleware.authFoodPartnerMiddleware, foodController.getFoodById);

module.exports = router;