
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/sendMessage',function(req,res){
  message=req.body.message;
  username=req.body.username;
  roomName=req.body.roomName;
  room_clients=clients[roomName];
  room.findOne({'roomName':roomName},function(err,data){
    try{
        current_messages=data.messages;
        current_messages.push({'username':username,'message':message});
        console.log('---------------------------clients at this time---------------------');
        console.log(clients);
        Object.keys(room_clients).forEach(function(key,index){
          console.log('accessing '+key);
          try{
            room_clients[key].send(JSON.stringify({'message_type':'message','username':username,'message':message}));
          }catch(e){};
        });
        room.update({'roomName':roomName},{'messages':current_messages},function(){
          endResponse();
        });
      }catch(e){
        console.log('--------------Error so not doing it------------')
        req.session.username=undefined;
        req.session.roomName=undefined;
        req.session.usertype=undefined;
        res.redirect('/');
      }
  });
  function endResponse() {
    res.end('request completed');
  }
});

module.exports=router;
