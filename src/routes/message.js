const express = require("express");
const { newmessage, getmessage } = require("../controller/message");
const { verifyToken } = require("../middleware/middleware");

const router = express.Router();

router.post("/newmessage",verifyToken, newmessage);
router.post("/getmessage", verifyToken, getmessage);

module.exports = router;
