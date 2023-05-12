const express = require("express");
const router = express.Router();
const auth=require("../middlewares/auth")

const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");

router.get('/home', auth.isAdmin, homeController.GetHome);

router.get('/',auth.isNotAuth, authController.GetLogin);
router.post("/login",auth.isNotAuth,authController.PostLogin);

router.get('/admin',auth.isNotAuth,authController.GetAdmin)
router.post('/admin',auth.isNotAuth,authController.PostAdmin)

router.post("/logout",authController.PostLogOut);

module.exports = router; 