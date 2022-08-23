const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if(cookies){
    const token = cookies.split("=")[1];
    jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res
          .status(200)
          .json({ success: false, " message": "Invalid Token" });
      }
      req.id = user.id;
      next();
    });
  }
  else{
    res.status(200).json({ success: false, message: "No token found" });
   
  }
};

exports.verifyToken = verifyToken;
