var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');



router.get('/', function(req, res, next){
  oracledb.maxRows=50;

   console.log(req.session.empauth);

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
        "SELECT J.TESTPROJ, T.PROJNAME, T.STARTDATE, J.TESTTYPE, J.STARTDATE, J.ENDDATE, J.DESCRIPTION, J.REPORT FROM TESTPROJ T, PROJECTJOB J WHERE J.TESTER='"+ req.session.empno+"' AND J.TESTPROJ = T.PROJECTNO ",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var job=result.rows;

          connection.execute(
            "SELECT * from PHONE",
            function(err,result){
              if (err) { console.error(err.message); return;}
              var phones=result.rows;
            res.render('job', {emp:req.session, jobs:job, phones:phones});
          });
        });
    });
});

router.get('/testing', function(req, res, next){
  oracledb.maxRows=50;
  var type = req.query.testtype;
  var projnum = req.query.projnum;
  var tester = req.session.empno;


  console.log(req.session.empauth);
  console.log("type:"+type);
  console.log("projnum:"+projnum);
  console.log("tester:"+tester);

  if(type == 0){

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
          "SELECT DISTINCT B.BUGNO, B.SUMMARY, B.DESCRIPTION FROM BUG B, PHONE P, TESTPROJ T WHERE B.PHONE=P.PHONENO AND P.PHONEGROUP=T.PHONEGROUP",  // bind value for :id
          function(err, result)
          {
            if (err) { console.error(err.message); return; }
            console.log(result.rows);
            var bug=result.rows;

            res.render('testing', {type:type,bugs:bug});
          });
      });
  }else if(type == 1){

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
        "SELECT S.SETNO, S.CASENO, S.TITLE, S.TESTPROJ, S.RESULT, C.SUMMARY, C.DESCRIPTION, C.CASEER FROM MANUALSET S, MANUALCASE C WHERE S.TESTPROJ ='"+projnum+"' AND S.TESTER = '"+tester+"' AND C.CASENO=S.CASENO",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var manual=result.rows;

          res.render('testing', {type:type,manuals:manual});
        });
    });

  }else if(type == 2){
      res.render('testing', {type:type});
  }

});


router.get('/describe', function(req, res, next){
  oracledb.maxRows=50;

  var des = req.query.description;
  var projnum = req.query.projnum;
  var testtype = req.query.testtype;

  console.log(projnum);
  console.log(req.session.empno);
  console.log(testtype);
  console.log(des);

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
        "UPDATE PROJECTJOB SET REPORT='"+des+"' where TESTPROJ='"+projnum+"' AND TESTTYPE ='"+testtype+"' AND TESTER='"+req.session.empno+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  flag = true;
                  res.write("<html><body><script>alert('Failed Submit'); location.href='/job';</script></body>");
                  return;
                }
                  res.write("<html><body><script>alert('Success Submit'); location.href='/job';</script></body>");

              });
        });
    });

});

router.get('/typeresult', function(req, res, next){
  oracledb.maxRows=50;

  var setno = req.query.setno;
  var caseno = req.query.caseno;
  var projnum = req.query.projnum;
  var tester = req.session.empno;
  var result = req.query.result;
  var type = req.query.testtype;

  console.log("setnum:"+setno);
  console.log("casenum:"+caseno);
  console.log("projnum:"+projnum);
  console.log("tester:"+tester);
  console.log("result:"+result);
  console.log("type:"+type);

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
        "UPDATE MANUALSET SET RESULT="+result+" where TESTPROJ='"+projnum+"' AND SETNO ='"+setno+"' AND CASENO='"+caseno+"' AND TESTER='"+req.session.empno+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  flag = true;
                  res.write("<html><body><script>alert('Failed Submit'); location.href='/job/testing';</script></body>");
                  return;
                }
                  var url = '/job/testing?testtype='+type+'&projnum='+projnum;
                  //res.write("<html><body><script>alert('Success Submit'); location.href='/job/testing?testtype='"+type+"'&projnum='"+projnum+"';</script></body>");
                  res.write("<html><body><script>alert('Success Submit'); location.href='"+url+"';</script></body>");
              });
        });
    });

});


router.get('/endjob', function(req, res, next){
  oracledb.maxRows=50;

  var type = req.query.testtype;
  var projnum = req.query.projnum;
  var tester = req.session.empno;
  var now = moment().format("YYYYMMDD");

   console.log(req.session.empauth);

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
        "UPDATE PROJECTJOB set ENDDATE=TO_DATE('"+now+"','yyyyMMddhh24miss') where TESTPROJ='"+projnum+"' AND TESTTYPE ='"+type+"' AND TESTER='"+req.session.empno+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  flag = true;
                  res.write("<html><body><script>alert('Failed ending'); location.href='/job';</script></body>");
                  return;
                }
                  res.write("<html><body><script>alert('Success ending'); location.href='/job';</script></body>");

              });
        });
    });

});

module.exports = router;

