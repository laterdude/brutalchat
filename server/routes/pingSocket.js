
var express = require('express');
var router = express.Router();

router.post('/pingSocket',function(req,res){
  roomName=req.session.roomName;
  username=req.session.username;
  clients[roomName][username].send(JSON.stringify({'message_type':'ping','username':username}));
  res.end('');
});

module.exports=router;