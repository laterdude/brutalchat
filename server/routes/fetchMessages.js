
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/fetchMessages',function(req,res){
  room.findOne({'roomName':req.session.roomName},function(err,data){
    endResponse(data.messages);
  });
  function endResponse(messages) {
    res.end(JSON.stringify(messages));
  }
});

module.exports=router;
