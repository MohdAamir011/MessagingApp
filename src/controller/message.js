const router=require('express').Router()
const message=require('../models/message')
const varifyuser=require('../middleware/middleware')

//create messages

const newmessage = async (req,res)=>{

    try{  
const mes= new message({
    members:[req.id,req.body.reciever], 
    text:req.body.text,
    sendername:req.body.sendername  
});
const m=await mes.save()
res.status(200).json({"success":true,"message":m})
}catch(e){
    res.status(400).json({"success":false,"message":"some error occured","error":e.message})
}
}

//get messages of user

const getmessage = async (req,res)=>{
    try{  

        const m=await message.find({members:{$all:[req.id,req.body.reciever]}})
  res.status(200).json({"success":true,"message":m})

}catch(e){
    res.status(400).json({"success":false,"message":"some error occured","error":e.message})
}
}

exports.getmessage = getmessage;
exports.newmessage = newmessage;