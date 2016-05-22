var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');


router.get('/testcase', function(req, res, next){
  oracledb.maxRows=100;
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
        "SELECT * from  manualcase",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test/testcase', {emp:req.session, testcases:result.rows});
        });
    });
});

router.get('/testcase/modify/:id', function(req, res, next){
  var id = req.params.id;
  oracledb.maxRows=100;
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
        "SELECT * from  manualcase where caseno="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test/testcase_modify', {emp:req.session, testcase:result.rows[0]});
        });
    });
});

router.get('/testcase/add', function(req, res, next){
  oracledb.maxRows=100;
  res.render('test/testcase_add', {emp:req.session});
});

router.post('/testcase/add/commit', function(req, res, next){
  var summary = req.body.tcsummary;
  var description = req.body.tcdescription;
  var tcer = req.body.tcer[1];

  console.log(summary + " " + description + " " + tcer);
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
        "insert into MANUALCASE (SUMMARY, DESCRIPTION, CASEER) VALUES('"+summary+"', '"+description+"', "+tcer+")",
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
          res.redirect('/test/testcase');
        });
    });
});

router.post('/testcase/modify/commit/:id', function(req, res, next){
  var id = req.params.id;
  var summary = req.body.tcsummary;
  var description = req.body.tcdescription;
  var tcer = req.body.tcer[1];

  console.log(summary + " " + description + " " + tcer);
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
        "update manualcase set summary='"+summary+"', description='"+description+"', caseer="+tcer+" where caseno="+id,
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
          res.redirect('/test/testcase');
        });
    });
});

router.get('/testcase/delete/:id', function(req, res, next){
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
        "delete from manualcase where caseno="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/test/testcase');
        });
    });
});

module.exports = router;
