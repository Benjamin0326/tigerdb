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
      connection.execute(
        "SELECT * from schedule s, employee e where s.writer=e.empno AND enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          var schedule = result.rows;
          connection.execute(
            "SELECT * from schedule s, employee e where s.writer=e.empno AND enddate<TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate DESC ",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              res.render('schedule', {emp:req.session, schedules:schedule, total:result.rows});
            });
        });
    });
});

router.get('/add', function(req, res){
  res.render('schedule/add', {emp:req.session});
});

router.post('/add/commit', function(req, res, next){
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
          res.redirect('/schedule');
        });
    });
});

router.get('/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT s.schno, s.schtitle, s.schdes, s.writer, s.startdate, s.enddate, e.empname, e.email from schedule s, employee e where s.schno='"+id+"' and s.writer=e.empno",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          //console.log(result.rows[0][4]);
          var iswriter=false;
          if(result.rows[0][3]==req.session.empno){
            iswriter=true;
          }

          res.render('schedule/view', {emp:req.session, schedules:result.rows[0], iswriter:iswriter});
        });
    });
});

router.get('/modify/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT schno, schtitle, schdes, writer, to_char(startdate, 'mm/dd/yyyy'), to_char(enddate, 'mm/dd/yyyy') from schedule where schno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);

          res.render('schedule/modify', {emp:req.session, schedules:result.rows[0]});
        });
    });
});

router.post('/modify/commit/:id', function(req, res, next){
  var id = req.params.id;
  var title = req.body.schtitle;
  var description = req.body.schcontent;
  var tmpstart = req.body.startdate;
  var tmpend = req.body.enddate;
  var startdate = tmpstart.toString().substr(6,4)+tmpstart.toString().substr(0,2)+tmpstart.toString().substr(3,2);
  var enddate = tmpend.toString().substr(6,4)+tmpend.toString().substr(0,2)+tmpend.toString().substr(3,2);

  console.log(title + " " + description);
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
        "update schedule set schtitle='"+title+"', SCHDES='"+description+"', STARTDATE=TO_DATE('"+startdate+"','yyyyMMddhh24miss'), ENDDATE=TO_DATE('"+enddate+"','yyyyMMddhh24miss') where schno='"+id+"'",
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

router.get('/delete/:id', function(req, res, next){
  var id = req.params.id;
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

module.exports = router;
