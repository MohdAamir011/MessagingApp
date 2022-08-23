const express = require("express");
const router = express.Router();

const { getUser,getAllUser } = require("../controller/user.js");
const  {verifyToken}  = require("../middleware/middleware.js");


router.get("/profile", verifyToken, getUser);
router.get("/getalluser", verifyToken, getAllUser);


module.exports = router;
