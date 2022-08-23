const express = require("express");
const mongoose = require("mongoose");
const authrouter = require("./src/routes/auth");
const userrouter = require("./src/routes/user");
const messagerouter = require("./src/routes/message");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bp=require('body-parser')
const dotenv=require('dotenv')
const socketio=require('socket.io')
const app = express();
const http =require("http")
const path=require("path")

app.use(cors({ credentials : true,  origin: "http://localhost:3000" }));
app.use(bp.json({limit:'5mb'}))
app.use(bp.urlencoded({limit:'5mb',extended:true}))
app.use(cookieParser());
app.use(express.json());



app.use("/api", authrouter);
app.use("/api", messagerouter);
app.use("/api", userrouter);
dotenv.config()


if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") 
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
  });


mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

  const server=http.createServer(app);

  var users=[]

  const io=socketio(server)


  
  const addusers=(userid,socketid)=>{
        if(userid===null){return}
      if(users.some((user)=>user.userid===userid) ){
          const u =  users.filter((elem)=>{return elem.userid  !== userid})
          users=[...u,{userid,socketid}]
      }
      else{
      users.push({userid,socketid})
  }}
  
  const getuser=(id)=>{
    return  users.find((elem)=>{elem.userid==id}) 
  } 
  
  
  io.on('connection',(socket)=>{
      //when connect
      console.log(' user connected')
  
      //add and remove users
      socket.on('adduser',(userid)=>{
          addusers(userid,socket.id)
          io.emit('getuser',users)        
      })
  //send and get message
   socket.on('sendmessage',({sender,reciever,text,sendername})=>{ 
      
        const user=users.find((elem)=>{return elem.userid===reciever})
        if(user){ 
  
          io.to(user.socketid).emit("getmessage",{
              reciever,
              sender,
              text,
              sendername
          })
        }
  
  })
  //diconnect user
      socket.on('disconnect',()=>{
        const u =  users.filter((elem)=>{return elem.socketid  !== socket.id})
        users=[...u]
        io.emit('getuser',users)    
    console.log('user disconnect')
          })
  })
  

  server.listen(process.env.PORT || 5000,()=>{
    console.log('server is listening on port 5000 ....')
    })