var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

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
        "SELECT * from phone",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('phone', {emp:req.session, phones:result.rows});
        });
    });
});

router.get('/phone_add', function(req, res){
  console.log('here');
  res.render('hardware/phone_add', {emp:req.session});
})

router.post('/add_commit', function(req, res, next){
  
  var data = JSON.parse(req.body.data); 
  console.log(data)
  
  var phonename = data[0].phonename;
  var manu = data[0].manufacture;
  var osver = data[0].osver;
  
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
        "insert into phone (PHONENAME, MANUFACTURE, OSVER, STATE) VALUES('"+phonename+"', '"+manu+"', '"+osver+"', 0)",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          res.redirect('/phone');
        });
    });
});

router.post('/commit', function(req, res, next){
  console.log("test phone");
  var editdata = JSON.parse(req.body.data);
  console.log(editdata);
  var i = 0;
  var len = editdata.length;
  console.log("length : " + len);
    oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "0305",
      connectString : "localhost/DBSERVER"
    },
    function(err, connection)
    {
      if (err) { console.error(err.message); return; }
      for(i=0; i<len; i++){
        var t_id = editdata[i].id;
        var t_phonename = editdata[i].phonename;
        var t_manu = editdata[i].manufacture;
        var t_os = editdata[i].osver;
        var t_state = editdata[i].state;
        var t_renter = editdata[i].renter;

        if(t_id!=null){
          connection.execute(
            "UPDATE phone set phonename='"+t_phonename+"', manufacture='"+t_manu+"', osver='"+t_os+"', state='"+t_state+"', renter='"+t_renter+"' where phoneno='"+t_id+"'",  // bind value for :id
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
        else{
          console.log("it'will be delete part");
          t_id=editdata[i];
          console.log("delete : "+t_id);
          connection.execute(
            "delete from phone where phoneno='"+t_id+"'",  // bind value for :id
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
      }

    });
});

module.exports = router;
