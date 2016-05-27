var express = require('express');
var oracledb = require('oracledb');
var moment = require('moment');
var router = express.Router();

router.get('/', function(req, res, next){
  oracledb.maxRows=100;
  if(req.session.empauth>3){
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
        "SELECT * from  testproj",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test', {emp:req.session, project:result.rows});
        });
    });
  }else if(req.session.empauth>2){
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
        "SELECT * from  testproj where manager="+req.session.empno,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test', {emp:req.session, project:result.rows});
        });
    });
  }else{
    res.render('test', {emp:req.session});
  }
});

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

router.get('/testset/add', function(req, res, next){
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
        "SELECT * from manualcase",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var testcases=result.rows;
          connection.execute(
            "SELECT * from testproj",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var projects=result.rows;
              connection.execute(
                "SELECT * from employee",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var testers=result.rows;
                  res.render('test/testset_add', {emp:req.session, testcases:testcases, projects:projects, testers:testers});
                });
            });
        });
    });
});

router.get('/testset/:id', function(req, res, next){
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
        "SELECT s.setno, s.title, s.description, c.summary, c.description, c.caseer, t.projname, e.empname from manualset s, testproj t, employee e, manualcase c where s.testproj=t.projectno and e.empno=s.tester and c.caseno=s.caseno and s.setno="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test/testset_view', {emp:req.session, infos:result.rows});
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

router.post('/testset/add/commit', function(req, res, next){
  var setno = moment().format("x");
  var title = req.body.tstitle;
  var description = req.body.tsdescription;
  var proj = req.body.tsproj;
  proj = proj.substr(1,proj.toString().indexOf(")")-1);
  var tester = req.body.tstester;
  tester = tester.substr(1,tester.toString().indexOf(")")-1);
  var tc = req.body.testcases;
  var i = 0;
  console.log(tc.length);
  console.log(title, description, proj, tester, tc);
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      for(i=0;i<tc.length;i++){
        connection.execute(
          "insert into MANUALSET (SETNO, CASENO, DESCRIPTION, TESTPROJ, TESTER, TITLE) VALUES("+setno+", "+tc[i]+", '"+description+"', "+proj+", "+tester+", '"+title+"')",
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
          });
      }

      res.redirect('/test/testset');
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

router.get('/testset/delete/:id', function(req, res, next){
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
        "delete from manualset where setno="+id,  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });

          res.redirect('/test/testset');
        });
    });
});

router.get('/testset', function(req, res, next){
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
        "SELECT DISTINCT s.setno, s.title, t.projname, e.empname from manualset s, testproj t, employee e where s.testproj=t.projectno and e.empno=s.tester",  // bind value for :id

        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('test/testset', {emp:req.session, testsets:result.rows});

        });
    });
});


router.get('/project/add', function(req, res){
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
        "SELECT * from employee where auth>2",  // bind value for :id
       function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);

          var manager=result.rows;
          connection.execute("SELECT DISTINCT phonegroup from PHONE",
          function(err, result){
            if(err) { console.error(err.message); return; }
            console.log(result.rows);
            res.render('project/add', {emp:req.session, managers:manager, group:result.rows});
          });
        });
    });
});

router.post('/project/add/commit', function(req, res, next){
  var group = req.body.group;
  var title = req.body.projname;
  var tmanager = req.body.manager;
  var manager = parseInt(tmanager.substr(tmanager.indexOf("(")+1, tmanager.length-1));
  var desc = req.body.description;
  var tmpstart = req.body.startdate;
  var sdate = tmpstart.toString().substr(6,4)+tmpstart.toString().substr(0,2)+tmpstart.toString().substr(3,2);
  console.log(sdate);
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
        "insert into TESTPROJ (PROJNAME, STARTDATE, PHONEGROUP, MANAGER, DESCRIPTION) VALUES('"+title+"', '"+sdate+"', '"+group+"', '"+manager+"','"+desc+"')",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          res.redirect('/test');
        });
    });
});

module.exports = router;
