var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

/* GET users listing. */
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
        });
    });

  res.send('respond with a resource');
});



module.exports = router;
