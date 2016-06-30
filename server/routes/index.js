
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.username!=undefined&&req.session.username!=null) {
    res.redirect('/chat');
  }
  else {
    res.render('index');
  }
});

module.exports=router;
