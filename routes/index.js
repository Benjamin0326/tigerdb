var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { flag: 0});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  oracledb.getConnection(
    {
      user          : "system",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      console.log(email, password);
      connection.execute(
        "select * from EMPLOYEE where email='"+email+"'",
        function(err, result)
        {
          console.log(err);
          //console.log(result.rows[0][7]);
          console.log(result.rows[0]);
          if(result.rows[0]!=null){
            if(result.rows[0][7]==password){
              if(result.rows[0][3]==0){
                res.render('index', { flag: 1 });
              }
              else if(result.rows[0][7]==password){
                req.session.empno=result.rows[0][0];
                req.session.empname=result.rows[0][1];
                req.session.empauth=result.rows[0][3];
                res.redirect('home');
              }
              else{
                //res.render('index', { title: 'Incorrect Email/Password'});
                res.render('index', {flag: -1});
              }
            }
            else{
                //res.render('index', { title: 'Incorrect Email/Password'});
                res.render('index', {flag: -1});
              }
          }else{
            //res.render('index', { title: 'Incorrect Email/Password'});
                res.render('index', {flag: -1});
          }
        });
    });
});

router.post('/enroll', function(req, res, next) {
  var email = req.body.email;
  var name = req.body.empname;
  var address = req.body.address;
  var phone = req.body.phone;
  var password = req.body.password;

  oracledb.getConnection(
    {
      user          : "system",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      console.log(name, address, phone, email, password);
      connection.execute(
        "insert into EMPLOYEE (EMPNAME, AUTH, ADDRESS, PHONE, EMAIL, PASSWORD) VALUES('"+name+"', 1000, '"+address+"', '"+phone+"', '"+email+"', '"+password+"')",
        function(err, result)
        {
          console.log(err);
          console.log(result);
          connection.commit(function(err){
            if(err){
              res.render('index', { title: 'Failed!!' });
              return;
            }
          });
          if(!err){
            res.render('index', { title: 'Success!!' });
          }
          else{
            res.render('index', { title: 'Failed!!' });
          }

        });
    });
});

router.get('/home', function(req, res, next){
  console.log(req.session.empname);
  var empname = req.session.empname;

  oracledb.getConnection(
    {
      user          : "system",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
        if(req.session.empauth==1001){
          oracledb.maxRows=5;
          connection.execute(
            "select * from notice order by ntcdate desc",
            function(err, result)
            {
              console.log(err);
              console.log(result.rows[0]);
              var notice_values=result.rows;
              oracledb.maxRows=5;
              connection.execute(
                "select * from bug where reporter="+req.session.empno+" order by bugdate desc",
                function(err, result)
                {
                  console.log(err);
                  console.log(result.rows[0]);
                  var bug_values=result.rows;
                  var now = moment().format("YYYYMMDDhhmmss");
                  now = now-1000000;
                  oracledb.maxRows=5;
                  connection.execute(
                    "SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ",
                    function(err, result)
                    {
                      var schedule_values=result.rows;
                      connection.execute(
                        "SELECT count(*) from projectjob where tester="+req.session.empno+" and enddate is null",
                        function(err, result)
                        {
                          var projecting = result.rows[0];
                          connection.execute(
                            "SELECT count(*) from projectjob where tester="+req.session.empno+" and enddate is not null",
                            function(err, result)
                            {
                              var projected = result.rows[0];
                              res.render('home', {bug_values:bug_values, notice_values:notice_values, schedule_values:schedule_values, emp:req.session, projecting:projecting, projected:projected});
                            });
                        });
                    });
                });
            });
        }else if(req.session.empauth==1002){
          oracledb.maxRows=5;
          connection.execute(
            "select * from notice order by ntcdate desc",
            function(err, result)
            {
              console.log(err);
              console.log(result.rows[0]);
              var notice_values=result.rows;
              oracledb.maxRows=5;
              var now = moment().format("YYYYMMDDhhmmss");
              now = now-1000000;
              connection.execute(
                "SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ",
                function(err, result)
                {
                  console.log(err);
                  console.log(result.rows[0]);
                  var schedule_values=result.rows;
                  oracledb.maxRows=5;
                  connection.execute(
                    "SELECT count(*), status from phone group by status order by status",
                    function(err, result)
                    {
                      var phones=result.rows;
                      connection.execute(
                        "SELECT count(*), state from usim group by state order by state",
                        function(err, result)
                        {
                          var usims = result.rows;
                          console.log(phones, usims);
                          res.render('home', {notice_values:notice_values, schedule_values:schedule_values, emp:req.session, phones:phones, usims:usims});
                        });
                    });
                });
            });
        }else if(req.session.empauth==1003){
          oracledb.maxRows=5;
          connection.execute(
            "select * from notice order by ntcdate desc",
            function(err, result)
            {
              console.log(err);
              console.log(result.rows[0]);
              var notice_values=result.rows;
              oracledb.maxRows=5;
              var now = moment().format("YYYYMMDDhhmmss");
              now = now-1000000;
              connection.execute(
                "SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ",
                function(err, result)
                {
                  console.log(err);
                  console.log(result.rows[0]);
                  var schedule_values=result.rows;
                  oracledb.maxRows=5;
                  connection.execute(
                    "SELECT count(*) from testproj where manager="+req.session.empno+" and enddate is null",
                    function(err, result)
                    {
                      var projecting=result.rows[0];
                      connection.execute(
                        "SELECT count(*) from testproj where manager="+req.session.empno+" and enddate is not null",
                        function(err, result)
                        {
                          var projected=result.rows[0];
                          connection.execute(
                            "SELECT count(*), t.projname from bug b, testproj t where b.status!=4 and b.testproj=t.projectno and t.manager="+req.session.empno+" group by t.projname",
                            function(err, result)
                            {
                              var projbugs = result.rows;
                              res.render('home', {notice_values:notice_values, schedule_values:schedule_values, emp:req.session, projecting:projecting, projected:projected, projbugs:projbugs});
                            });
                        });
                    });
                });
            });
        }else if(req.session.empauth==1004){
          oracledb.maxRows=5;
          connection.execute(
            "select * from notice order by ntcdate desc",
            function(err, result)
            {
              console.log(err);
              console.log(result.rows[0]);
              var notice_values=result.rows;
              oracledb.maxRows=5;
              var now = moment().format("YYYYMMDDhhmmss");
              now = now-1000000;
              connection.execute(
                "SELECT * from schedule where enddate>=TO_DATE('"+now+"','yyyyMMddhh24miss') order by enddate ",
                function(err, result)
                {
                  console.log(err);
                  console.log(result.rows[0]);
                  var schedule_values=result.rows;
                  oracledb.maxRows=5;
                  connection.execute(
                    "SELECT count(*) from testproj where enddate is null",
                    function(err, result)
                    {
                      var projecting=result.rows[0];
                      connection.execute(
                        "SELECT count(*) from testproj where enddate is not null",
                        function(err, result)
                        {
                          var projected=result.rows[0];
                          connection.execute(
                            "SELECT count(*), t.projname from bug b, testproj t where b.status!=4 and b.testproj=t.projectno group by t.projname",
                            function(err, result)
                            {
                              var projbugs = result.rows;
                              res.render('home', {notice_values:notice_values, schedule_values:schedule_values, emp:req.session, projecting:projecting, projected:projected, projbugs:projbugs});
                            });
                        });
                    });
                });
            });
        }

    });
});

router.get('/signup', function(req, res, next){
  res.render('signup');
});

router.get('/profile', function(req, res, next){
  res.render('profile', {emp:req.session});
});

module.exports = router;
