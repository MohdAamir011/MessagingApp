const express = require("express");
const {signup,login,logout,} = require("../controller/auth.js");
const {verifyToken} = require("../middleware/middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken,logout);

module.exports = router;
