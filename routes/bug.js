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
        "SELECT * from bug b, testproj t where b.testproj=t.projectno order by bugdate desc",  // bind value for :id
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
            });
        });
    });
});

router.get('/project/:id', function(req, res, next){
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
        "SELECT * from bug where testproj = '"+id+"' order by bugdate desc ",  // bind value for :id
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
            });
        });
    });
});

router.get('/category/:id', function(req, res, next){
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
        "SELECT * from bug where category = '"+id+"' order by bugdate desc ",  // bind value for :id
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
              connection.execute(
                "SELECT distinct phonegroup from phone",  // bind value for :id
                function(err, result)
                {
                  if (err) { console.error(err.message); return; }
                  console.log(result.rows);
                  var phonegroups=result.rows;
                  connection.execute(
                    "SELECT projectno, projname from testproj",  // bind value for :id
                    function(err, result)
                    {
                      if (err) { console.error(err.message); return; }
                      console.log(result.rows);
                      var projects=result.rows;
                      res.render('bug', {emp:req.session, bugs:bugs, phones:phones, phonegroups:phonegroups, projects:projects});
                    });
                });
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
          var infos=result.rows;
          connection.execute(
            "SELECT * from testproj",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var projects = result.rows;

              res.render('bug/modify', {emp:req.session, infos:infos, projects:projects});
            });
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
  var project = req.body.project;
  var category = req.body.category;
  var now = moment().format("YYYYMMDDhhmmss");
  phone = phone.substr(1,phone.toString().indexOf(")")-1);
  project = project.substr(1,project.toString().indexOf(")")-1);
  category = category.substr(1,category.toString().indexOf(")")-1);
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
        "update bug set SUMMARY='"+summary+"', DESCRIPTION='"+description+"', BUGDATE=TO_DATE('"+now+"','yyyyMMddhh24miss'), PHONE="+phone+", STATUS="+status+", TYPE='"+type+"', CATEGORY="+category+", TESTPROJ="+project+" where BUGNO='"+id+"'",
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
          var phones=result.rows;
          connection.execute(
            "SELECT * from testproj",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var testprojs=result.rows;
              res.render('bug/report', {emp:req.session, phones:phones, testprojs:testprojs});
            });
        });
    });
});

router.post('/report/commit', function(req, res, next){
  var summary = req.body.bugsummary;
  var description = req.body.bugdescription;
  var type = req.body.bugtype;
  var phone = req.body.phone;
  var project = req.body.project;
  var category = req.body.category;
  var now = moment().format("YYYYMMDDhhmmss");
  console.log("index : " + phone.toString().indexOf(")"));
  phone = phone.substr(1,phone.toString().indexOf(")")-1);
  project = project.substr(1,project.toString().indexOf(")")-1);
  category = category.substr(1,category.toString().indexOf(")")-1);
  console.log("phone : " + phone + "category : " + category + "project : " + project);
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
        "insert into BUG (SUMMARY, DESCRIPTION, REPORTER, BUGDATE, PHONE, STATUS, TYPE, CATEGORY, TESTPROJ) VALUES('"+summary+"', '"+description+"', '"+req.session.empno+"', TO_DATE('"+now+"','yyyyMMddhh24miss'), "+phone+", 0, '"+type+"', "+category+", "+project+")",
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
        "SELECT b.bugno, b.summary, b.description, b.reporter, b.bugdate, b.phone, b.status, b.type, p.phonename, p.osver, e.empname, p.phonegroup, b.category, b.testproj, t.projname from bug b, phone p, employee e, testproj t where b.bugno='"+id+"' and b.reporter=e.empno and b.phone=p.phoneno and b.testproj=t.projectno",  // bind value for :id
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
