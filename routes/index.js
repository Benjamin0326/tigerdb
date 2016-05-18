var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'welcome to TigerDB'});

});

router.get('/logout', function(req, res, next) {
  req.session=null;
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
          if(result.rows[0]==null){
            res.render('index', { title: '존재하지 않는 아이디입니다.' });
            return;
          }
          //console.log(result.rows[0][7]);
          //console.log(result.rows[0]);
          else if(result.rows[0][3]==0){
            res.render('index', { title: '가입 승인이 나지 않았습니다.' });
          }
          else if(result.rows[0][7]==password){
            req.session.empno=result.rows[0][0];
            req.session.empname=result.rows[0][1];
            req.session.empauth=result.rows[0][3];
            var progress_values = [{name:"test1", value:30}, {name:"test2", value:44}, {name:"test3", value:100}, {name:"test4", value:73}];
            var notice_values = ["title1", "title2", "title3"];
            //res.render('home', {progress_values:progress_values, notice_values:notice_values});
            res.redirect('home');
          }
          else{
            res.render('index', { title: 'Incorrect Password' });
          }

        });
    });

  //console.log(email);
  //res.render('index', { title: 'TigerDB' });
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
        "insert into EMPLOYEE (EMPNAME, AUTH, ADDRESS, PHONE, EMAIL, PASSWORD) VALUES('"+name+"', '0', '"+address+"', '"+phone+"', '"+email+"', '"+password+"')",
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

  //console.log(email);
  //res.render('index', { title: 'TigerDB' });
});

router.get('/home', function(req, res, next){
  console.log(req.session.empname);
  var progress_values = [{name:"test1", value:30}, {name:"test2", value:44}, {name:"test3", value:100}, {name:"test4", value:73}];
  var notice_values = ["title1", "title2", "title3"];
  var empname = req.session.empname;

  oracledb.maxRows=3;
  oracledb.getConnection(
    {
      user          : "system",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      connection.execute(
        "select n.title from notice n",
        function(err, result)
        {
          console.log(err);
          console.log(result.rows[0]);
          if(req.session===null)
            res.redirect('/');

          if(err){
            res.redirect('/');
            return;
          }
          else{
            res.render('home', {progress_values:progress_values, notice_values:result.rows, emp:req.session});
            return;
          }
        });
    });


});



router.get('/signup', function(req, res, next){
  res.render('signup');
});

router.get('/phone', function(req, res, next){
  res.render('phone', {emp:req.session});
});

router.get('/profile', function(req, res, next){
  res.render('profile', {emp:req.session});
});

router.get('/test', function(req, res, next){
  res.render('test', {emp:req.session});
});

module.exports = router;
