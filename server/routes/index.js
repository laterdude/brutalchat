
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.username!=undefined) {
    res.redirect('/chat');
    res.end();
  }
  res.render('index');
  res.end();
});

module.exports=router;
