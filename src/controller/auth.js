const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios=require('axios')


//sign-up
const signup = async (req, res) => {

  try {
      const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res
      .status(200)
      .json({"success":false, "message": "User email already exist" });
  }
  if (req.body.confirmPassword !== req.body.password) {
    return res
      .status(200)
      .json({ "success":false,"message": "password and confirm password are different" });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password);
  const data={
    "file":req.body.file,
    "cloud_name":process.env.CLUD_NAME,
    "upload_preset":process.env.UPLOAD_PRESET,
    "folder":"chatapp"
  }
  const resp = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,data);  
  if(resp.status===200){

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    profilePicture:resp.data.secure_url,
    public_id:resp.data.public_id
  });

  const u= await user.save();
  return res.status(200).json({ "success":true , message: u });
}}catch (error) {
         res.status(200).json({"success":false,"message":error}                                                               )
}};

//login

const login = async (req, res, next) => {
  try {
    const  existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    return res.status(200).json({ "success":false,message: "User not found " });
  }
  const isPasswordCorrect =   await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(200).json({"success":false, message: "Invalid credentials" });
  }
  const token =  jwt.sign({ id: existingUser._id }, process.env.JWT_KEY, {
    expiresIn: "18000s",
  });

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 18000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({"success":true,"message":"LOGOUT SUCCESSFULLY", user: existingUser, token });
  }catch (error) {
  console.log(error)
}};



// logout
const logout= (req,res  )=>{ 
 res.clearCookie(`${req.id}`)
 req.cookies[`${req.id}`]=''
   res.status(200).json({"success":true,"message":"LOGOUT SUCCESSFULLY"})
}

exports.signup = signup;
exports.login = login;
exports.logout = logout;
