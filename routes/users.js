var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

/* GET users listing. */
router.get('/edit', function(req, res, next) {
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
        "SELECT ADDRESS, PHONE, EMAIL, PASSWORD from employee where EMPNO='"+req.session.empno+"'",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('users/edit', {empname:req.session.empname, userinfo:result.rows[0]});
        });
    });
});

router.post('/edit/commit', function(req, res, next) {

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
        "update employee set empname='"+req.body.empname+"', address='"+req.body.address+"', phone='"+req.body.phone+"', email='"+req.body.email+"', password='"+req.body.password+"' where empno='"+req.session.empno+"'",  // bind value for :id
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
          req.session.empname=req.body.empname;
          res.redirect('/home');
        });
    });
});

router.get('/', function(req, res, next) {

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
          console.log(result.rows[0][0]);
        });
    });

  res.send('respond with a resource');
});



module.exports = router;
