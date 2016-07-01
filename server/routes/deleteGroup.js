
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/deleteGroup',function(req,res){
  roomName=req.session.roomName;
  if(req.session.usertype=='admin') {
    room.remove({'roomName':roomName},function(){
        room_clients=clients[roomName];
        clients[roomName]=[];
        Object.keys(room_clients).forEach(function(key,index){
          try{
            room_clients[key].send(JSON.stringify({'message_type':'room delete'}));
          }catch(e){console.log('could not send a delete message to a client')};
        });
    }).then(res.end('room deleted successfully'));;
  }
});

module.exports=router;
