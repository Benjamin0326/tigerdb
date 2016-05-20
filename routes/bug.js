var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');


router.get('/', function(req, res, next){
  oracledb.maxRows=50;
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      connection.execute(
        "SELECT * from bug order by bugdate desc",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('bug', {emp:req.session, bugs:result.rows});
        });
    });
});

router.get('/report', function(req, res, next){
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      connection.execute(
        "SELECT * from phone",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('bug/report', {emp:req.session, phones:result.rows});
        });
    });
});

router.post('/report/commit', function(req, res, next){
  var summary = req.body.bugsummary;
  var description = req.body.bugdescription;
  var type = req.body.bugtype;
  var phone = req.body.phone;
  var now = moment().format("YYYYMMDDhhmmss");
  console.log("index : " + phone.toString().indexOf(")"));
  phone = phone.substr(1,phone.toString().indexOf(")")-1);
  console.log("phone : " + phone);
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }

      connection.execute(
        "insert into BUG (SUMMARY, DESCRIPTION, REPORTER, BUGDATE, PHONE, STATUS, TYPE) VALUES('"+summary+"', '"+description+"', '"+req.session.empno+"', TO_DATE('"+now+"','yyyyMMddhh24miss'), '"+phone+"', 0, '"+type+"')",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          console.log(result.rows);
          res.redirect('/bug');
        });
    });
});






module.exports = router;
