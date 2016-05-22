var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

router.get('/', function(req, res, next){
  console.log('here');
  res.render('usim', {emp:req.session});
  //oracledb.maxRows=100;
  /*
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
        "SELECT * from usim",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('usim,', {emp:req.session, usims:result.rows});
        });
    });
*/
});

module.exports = router;
