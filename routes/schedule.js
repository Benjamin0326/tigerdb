var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');
var React = require('react');
var DatePicker = require('react-datepicker');


router.get('/', function(req, res, next){
  oracledb.maxRows=50;
  var now = moment().format("YYYYMMDDhhmmss");
  now = now-1000000;
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      console.log("SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ");
      connection.execute(
        "SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('schedule', {emp:req.session, schedules:result.rows});
        });
    });
});

router.post('/add', function(req, res, next){
  var title = req.body.schtitle;
  var description = req.body.schcontent;
  var tmpstart = req.body.startdate;
  var tmpend = req.body.enddate;
  var startdate = tmpstart.toString().substr(6,4)+tmpstart.toString().substr(0,2)+tmpstart.toString().substr(3,2);
  var enddate = tmpend.toString().substr(6,4)+tmpend.toString().substr(0,2)+tmpend.toString().substr(3,2);
  console.log(title + " " + description + " " + startdate + " enddate : " + enddate);
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
        "insert into SCHEDULE (SCHTITLE, SCHDES, WRITER, STARTDATE, ENDDATE) VALUES('"+title+"', '"+description+"', '"+req.session.empno+"', TO_DATE('"+startdate+"','yyyyMMddhh24miss'), TO_DATE('"+enddate+"','yyyyMMddhh24miss'))",
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
          res.redirect('/schedule');
        });
    });
});

router.post('/delete', function(req, res, next){
  var id = req.body.schno;
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
        "delete from schedule where schno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/schedule');
        });
    });
});

router.get('/total', function(req, res, next){
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
      console.log("SELECT * from schedule order by enddate ");
      connection.execute(
        "SELECT * from schedule order by enddate ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('schedule/total', {emp:req.session, schedules:result.rows});
        });
    });
});

module.exports = router;
