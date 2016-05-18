var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

router.get('/', function(req, res, next){
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
          res.render('phone', {emp:req.session, phones:result.rows});
        });
    });
});
/*
router.get('/add', function(req, res, next){
  console.log(req.session.empname + " " + req.session.empno);
  res.render('phone/add', {emp:req.session});
});

<<<<<<< HEAD
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
        "SELECT n.ntcno, n.title, n.des, n.writer, n.ntcdate, e.empname from notice n, employee e where n.ntcno='"+id+"' and n.writer=e.empno",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var iswriter=false;
          if(result.rows[0][3]==req.session.empno){
            iswriter=true;
          }

          res.render('notice/view', {emp:req.session, notices:result.rows[0], iswriter:iswriter});
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
        "SELECT * from notice where ntcno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);

          res.render('notice/modify', {emp:req.session, notices:result.rows[0]});
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
        "delete from notice where ntcno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/notice');
        });
    });
});



router.post('/write/commit', function(req, res, next){
  var title = req.body.ntctitle;
  var description = req.body.ntcdescription;
  var now = moment().format("YYYYMMDDhhmmss");

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
        "insert into NOTICE (TITLE, DES, WRITER, NTCDATE) VALUES('"+title+"', '"+description+"', '"+req.session.empno+"', TO_DATE('"+now+"','yyyyMMddhh24miss'))",
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

router.post('/modify/commit/:id', function(req, res, next){
  var id = req.params.id;
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
        "update notice set TITLE='"+title+"', DES='"+description+"', NTCDATE='"+now+"' where ntcno='"+id+"'",
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
*/
module.exports = router;
