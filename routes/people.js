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
        "SELECT * from employee e, totalcode c where e.auth=c.code",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var peoples=result.rows;
          connection.execute(
            "SELECT * from totalcode where MAJOR='AUTH'",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var codes=result.rows;
              res.render('people', {emp:req.session, peoples:peoples, codes:codes});
            });
        });
    });
});

router.get('/prize', function(req, res, next){
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
        "SELECT * from employee",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('management/prize', {emp:req.session, peoples:result.rows});
        });
    });
});

router.get('/prize/totallist', function(req, res, next){
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
        "SELECT * from prize p, employee e, totalcode c where p.winner=e.empno and p.type=c.code",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('management/totallist', {emp:req.session, winners:result.rows});
        });
    });
});

router.get('/prizelist/:id', function(req, res, next){
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
        "SELECT * from prize p, employee e, totalcode c where p.winner=e.empno and p.type=c.code and p.winner="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('management/list', {emp:req.session, winners:result.rows});
        });
    });
});


router.get('/prize/award/:id', function(req, res, next){
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
        "SELECT * from employee where empno="+id,
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var employees=result.rows[0];
          connection.execute(
            "SELECT * from totalcode where MAJOR='TYPE'",
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var codes=result.rows;
              res.render('management/award', {emp:req.session, employees:employees, codes:codes});
            });
        });
    });
});

router.post('/prize/award/commit/:id', function(req, res, next){
  var id = req.params.id;
  var prizename = req.body.prizename;
  var prizetype = req.body.prizetype;
  prizetype = prizetype.substr(1,prizetype.toString().indexOf(")")-1);
  var now = moment().format("YYYYMMDDhhmmss");
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
        "insert into PRIZE (PRIZENAME, WINNER, TYPE, PRIZEDATE) VALUES('"+prizename+"', "+id+", '"+prizetype+"', TO_DATE('"+now+"','yyyyMMddhh24miss'))",
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
          res.redirect('/people/prize');
        });
    });
});

router.get('/prize/award/delete/:id', function(req, res, next){
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
        "delete from prize where prizeno="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/people/prize');
        });
    });
});

router.get('/prize/award/modify/:id', function(req, res, next){
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
        "SELECT * from prize where prizeno="+id,
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var prize=result.rows[0];
          connection.execute(
            "SELECT * from employee",
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var winners=result.rows;
              connection.execute(
                "SELECT * from totalcode where MAJOR='TYPE'",
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var codes=result.rows;
                  res.render('management/modify', {emp:req.session, prize:prize, winners:winners, codes:codes});
                });
            });
        });
    });
});

router.post('/prize/award/modify/commit/:id', function(req, res, next){
  var id = req.params.id;
  var winner = req.body.winner;
  var prizename = req.body.prizename;
  var prizetype = req.body.prizetype;
  var now = moment().format("YYYYMMDDhhmmss");
  winner = winner.substr(1,winner.toString().indexOf(")")-1);
  prizetype = prizetype.substr(1,prizetype.toString().indexOf(")")-1);

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
        "update prize set prizename='"+prizename+"', winner="+winner+", prizedate=TO_DATE('"+now+"','yyyyMMddhh24miss'), type="+prizetype+" where prizeno="+id,
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
          res.redirect('/people/prize');
        });
    });
});

router.post('/commit', function(req, res, next){
  console.log("testestestest");
  var editdata = JSON.parse(req.body.data);
  console.log(editdata);
  var i = 0;
  var len = editdata.length;
  var flag=false;
  console.log("length : " + len);
    oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      for(i=0; i<len; i++){
        var t_position = editdata[i].position;
        var t_auth = editdata[i].auth;
        var t_id = editdata[i].id;
        var t_name = editdata[i].name;
        var t_address = editdata[i].address;
        if(t_id!=null){
          console.log(t_id);
          console.log(t_position);
          console.log(t_auth);
          t_auth = t_auth.substr(1,t_auth.toString().indexOf(")")-1);
          connection.execute(
            "UPDATE employee set empname='"+t_name+"', position='"+t_position+"', auth='"+t_auth+"', address='"+t_address+"' where empno='"+t_id+"'",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  flag=true;
                  res.send("실패했습니다.");
                  return;
                }
              });
            });
        }
        else{
          console.log("it'will be delete part");
          t_id=editdata[i];
          console.log("delete : "+t_id);
          connection.execute(
            "update EMPLOYEE set auth=1000 where empno='"+t_id+"'",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  flag=true;
                  res.send("실패했습니다.");
                  return;
                }
              });
            });
        }
      }
    });
    if(!flag)
      res.send('!');
});
module.exports = router;
