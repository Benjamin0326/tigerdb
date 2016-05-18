var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');


router.get('/', function(req, res, next){
  res.render('schedule', {emp:req.session});

});


module.exports = router;
