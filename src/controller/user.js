const user = require("../models/user.js");

const getUser = async (req, res) => {
  try {
    const u = await user.findById(req.id);
    if (!u) {
      return res.status(200).json({ success: true, message: "User not found" });
    }
    else {
      res.status(200).json({ success: true, message: u });
    }
  } catch (e) {
    console.log(e);
  }
};

//get all users

const getAllUser = async (req, res) => {
  try {
    let userdata = await user.find({});
    userdata = userdata.filter((elem) => {
      return elem._id != req.id;
    });
    res.status(200).json({ success: true, message: userdata });
  } catch (e) {
    res.status(200).json({ message: "some error occured" });
  }
};

exports.getUser = getUser;
exports.getAllUser = getAllUser;
