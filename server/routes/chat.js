
 const express = require('express');
 const router = express.Router();
 const mongoose = require('mongoose');
 const roomModel = require('../models/chatrooms') // import roomModel

 var room = roomModel.chatRoom;

 router.get('/chat',function(req,res){
   if(req.session.username==undefined||req.session.username==null) {
     res.redirect('/');
   }
   else {
    data=[{}];
    data[0].username=req.session.username;
     room.findOne({'roomName':req.session.roomName},function(err,d){
       data[0].roomName=d.roomName;
       data[0].userType=req.session.usertype;
       data[0].roomCreationDate=d.roomCreationDate;
       data[0].roomAdmin=d.roomAdmin;
       data[0].roomMembers=d.roomMembers;
       data[0].messages=d.messages;
       renderChat(data);
     })
     function renderChat(data) {
       res.render('chat',{'data':data});
     };
   }
 });



module.exports=router;
