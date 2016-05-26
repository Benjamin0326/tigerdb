var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('test', {emp:req.session});
});

router.get('/project_add', function(req, res){
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
        "SELECT * from employee where auth>1",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var manager=result.rows;
          res.render('/project/project_add', {emp:req.session, manager:managers});
        });
    });
});


module.exports = router;