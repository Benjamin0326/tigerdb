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
          var bugs=result.rows;
          connection.execute(
            "SELECT * from phone",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var phones=result.rows;
              res.render('bug', {emp:req.session, bugs:bugs, phones:phones});
            });
        });
    });
});

router.get('/phone/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT * from bug where phone = '"+id+"' order by bugdate desc ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var bugs=result.rows;
          connection.execute(
            "SELECT * from phone",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var phones=result.rows;
              res.render('bug', {emp:req.session, bugs:bugs, phones:phones});
            });
        });
    });
});

router.get('/phonegroup/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT * from bug join phone on bug.phone=phone.phoneno and phone.phonegroup = '"+id+"' order by bugdate desc ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var bugs=result.rows;
          connection.execute(
            "SELECT * from phone",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var phones=result.rows;
              res.render('bug', {emp:req.session, bugs:bugs, phones:phones});
            });
        });
    });
});

router.get('/status/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT * from bug where status = '"+id+"' order by bugdate desc ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var bugs=result.rows;
          connection.execute(
            "SELECT * from phone",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var phones=result.rows;
              res.render('bug', {emp:req.session, bugs:bugs, phones:phones});
            });
        });
    });
});

router.get('/type/:id', function(req, res, next){
  var id = req.params.id;
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
        "SELECT * from bug where type = '"+id+"' order by bugdate desc ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var bugs=result.rows;
          connection.execute(
            "SELECT * from phone",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var phones=result.rows;
              res.render('bug', {emp:req.session, bugs:bugs, phones:phones});
            });
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
        "SELECT * from bug b, phone p where b.bugno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);

          res.render('bug/modify', {emp:req.session, infos:result.rows});
        });
    });
});


router.post('/modify/commit/:id', function(req, res, next){
  var id = req.params.id;
  var summary = req.body.bugsummary;
  var description = req.body.bugdescription;
  var type = req.body.bugtype;
  var phone = req.body.phone;
  var status = req.body.bugstatus;
  var now = moment().format("YYYYMMDDhhmmss");
  phone = phone.substr(1,phone.toString().indexOf(")")-1);
  status = status[1];
  console.log("status : " + status+" phone : " + phone);

  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      console.log("update bug set SUMMARY='"+summary+"', DESCRIPTION='"+description+"', BUGDATE='TO_DATE('"+now+"','yyyyMMddhh24miss')', PHONE='"+phone+"', STATUS='"+status+"', TYPE='"+type+"' where BUGNO='"+id+"'");
      connection.execute(
        "update bug set SUMMARY='"+summary+"', DESCRIPTION='"+description+"', BUGDATE=TO_DATE('"+now+"','yyyyMMddhh24miss'), PHONE="+phone+", STATUS="+status+", TYPE='"+type+"' where BUGNO='"+id+"'",
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
        "delete from bug where bugno='"+id+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/bug');
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
        "insert into BUG (SUMMARY, DESCRIPTION, REPORTER, BUGDATE, PHONE, STATUS, TYPE) VALUES('"+summary+"', '"+description+"', '"+req.session.empno+"', TO_DATE('"+now+"','yyyyMMddhh24miss'), "+phone+", 0, '"+type+"')",
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
        "SELECT b.bugno, b.summary, b.description, b.reporter, b.bugdate, b.phone, b.status, b.type, p.phonename, p.osver, e.empname, p.phonegroup from bug b, phone p, employee e where b.bugno='"+id+"' and b.reporter=e.empno and b.phone=p.phoneno",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var iswriter=false;
          if(result.rows[0][3]==req.session.empno){
            iswriter=true;
          }

          res.render('bug/view', {emp:req.session, info:result.rows[0], iswriter:iswriter});
        });
    });
});





module.exports = router;
