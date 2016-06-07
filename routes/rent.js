var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next){
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
        "SELECT * from phone",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var phones=result.rows;
          connection.execute(
            "SELECT * from usim",
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var usims=result.rows;
              res.render('rent', {emp:req.session, phones:phones, usims:usims});
            });
        });
    });
});

router.get('/totallist', function(req, res, next){
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
        "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, e.email, p.phoneno, p.phonename, p.osver from rent r, employee e, phone p where r.renter=e.empno and r.phone=p.phoneno order by rentdate desc",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var phonerent=result.rows;
          connection.execute(
            "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, e.email, u.usimidx, u.usimno from rent r, employee e, usim u where r.renter=e.empno and r.usim=u.usimidx order by rentdate desc",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var usimrent=result.rows;
              res.render('rent/totallist', {emp:req.session, phonerents:phonerent, usimrents:usimrent});
            });
        });
    });
});

router.get('/phonerent', function(req, res, next){
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
        "SELECT * from phone where status=2000",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var phones=result.rows;
          connection.execute(
            "SELECT * from employee",
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var renters=result.rows;
              res.render('rent/phonerent', {emp:req.session, phones:phones, renters:renters});
            });
        });
    });
});

router.get('/phonelist/:id', function(req, res, next){
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
        "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, e.email, p.phoneno, p.phonename, p.osver from rent r, employee e, phone p where r.phone='"+id+"' and r.renter=e.empno and r.phone=p.phoneno order by rentdate desc",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('rent/phonelist', {emp:req.session, results:result.rows});
        });
    });
});

router.get('/phonerent/:id', function(req, res, next){
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
        "SELECT p.phoneno, p.phonename, p.manufacture, p.osver, e.empno, e.empname, e.email from phone p, employee e where p.phoneno='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('rent/phonerent', {emp:req.session, results:result.rows});
        });
    });
});

router.get('/phonereturn/:id', function(req, res, next){
  var id = req.params.id;
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
        "update phone set STATUS=2000 where phoneno='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          connection.execute(
            "update RENT set RETURNDATE=TO_DATE('"+now+"','yyyyMMddhh24miss') where PHONE='"+id+"' and RETURNDATE is null",
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
              res.redirect('/rent');
            });
        });
    });
});


router.post('/phonerent/commit/:id', function(req, res, next){
  var id = req.params.id;
  var renter = req.body.renter;
  var description = req.body.rentdescription;
  renter = renter.substr(1,renter.toString().indexOf(")")-1);
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
        "update phone set STATUS=2001 where phoneno='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          connection.execute(
            "insert into RENT (DESCRIPTION, RENTER, PHONE, RENTDATE) VALUES('"+description+"', "+renter+", "+id+", TO_DATE('"+now+"','yyyyMMddhh24miss'))",
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
              res.redirect('/rent');
            });
        });
    });
});

router.get('/usimlist/:id', function(req, res, next){
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
        "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, e.email, u.usimidx, u.usimno from rent r, employee e, usim u where r.usim='"+id+"' and r.renter=e.empno and r.usim=u.usimidx order by rentdate desc",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('rent/usimlist', {emp:req.session, results:result.rows});
        });
    });
});

router.get('/usimrent/:id', function(req, res, next){
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
        "SELECT u.usimidx, u.station, u.usimno, u.phoneno, u.description, e.empno, e.empname, e.email from usim u, employee e where u.usimidx='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('rent/usimrent', {emp:req.session, results:result.rows});
        });
    });
});

router.get('/usimreturn/:id', function(req, res, next){
  var id = req.params.id;
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
        "update usim set STATE=2000 where usimidx='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          connection.execute(
            "update RENT set RETURNDATE=TO_DATE('"+now+"','yyyyMMddhh24miss') where USIM='"+id+"' and RETURNDATE is null",
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
              res.redirect('/rent');
            });
        });
    });
});


router.post('/usimrent/commit/:id', function(req, res, next){
  var id = req.params.id;
  var renter = req.body.renter;
  var description = req.body.rentdescription;
  renter = renter.substr(1,renter.toString().indexOf(")")-1);
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
        "update usim set STATE=2001 where usimidx='"+id+"'",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          connection.execute(
            "insert into RENT (DESCRIPTION, RENTER, USIM, RENTDATE) VALUES('"+description+"', "+renter+", "+id+", TO_DATE('"+now+"','yyyyMMddhh24miss'))",
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
              res.redirect('/rent');
            });
        });
    });
});

module.exports = router;
