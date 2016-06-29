

var express = require('express');
var router = express.Router();

router.post('/logEachUserOut',function(req,res){
  roomName=req.session.roomName;
  username=req.session.username;
  usertype=req.session.usertype;
  req.session.username=undefined;
  req.session.roomName=undefined;
  req.session.usertype=undefined;
  res.end('request ended');
});

module.exports=router;
