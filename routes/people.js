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

router.post('/commit', function(req, res, next){
  var editdata = JSON.parse(req.body.data);
  var i = 0;
  var len = editdata.length;
    oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      console.log('q');
      if (err) { console.error(err.message); return; }
      for(i=0; i<len; i++){
        var t_position = editdata[i].position;
        var t_auth = editdata[i].auth;
        var t_id = editdata[i].id;
        console.log(t_id);
        console.log(t_position);
        console.log(t_auth);
        connection.execute(
          "UPDATE employee set position='"+t_position+"', auth='"+t_auth+"' where empno='"+t_id+"'",  // bind value for :id
          function(err, result)
          {
            if (err) { console.error(err.message); return; }
            connection.commit(function(err){
              if(err){
                res.send("실패했습니다.");
                return;
              }
            });          
          });
        }
    });   
});
module.exports = router;
