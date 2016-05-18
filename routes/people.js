var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

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
        "SELECT * from employee",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('people', {emp:req.session, peoples:result.rows});
        });
    });
});


module.exports = router;
