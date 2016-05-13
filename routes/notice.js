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
        "SELECT * from notice",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('notice', {empname:req.session.empname, notices:result.rows});
        });
    });
});

router.get('/write', function(req, res, next){
  res.render('notice/write', {empname:req.session.empname});
});

router.post('/write/commit', function(req, res, next){
  var title = req.body.ntctitle;
  var description = req.body.ntcdescription;
  var now = moment().format("YYYYMMDD");

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
        "insert into NOTICE (TITLE, DES, WRITER, NTCDATE) VALUES('"+title+"', '"+description+"', '"+req.session.empno+"', '"+now+"')",
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
          res.redirect('/notice');
        });
    });
});

module.exports = router;
