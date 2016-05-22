var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();

router.get('/', function(req, res, next){
  console.log('here');
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
        "SELECT * from usim",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          res.render('usim', {emp:req.session, usims:result.rows});
        });
    });
});

router.get('/usim_add', function(req, res){
  console.log('here');
  res.render('hardware/usim_add', {emp:req.session});
});

router.post('/add_commit', function(req, res, next){

  var data = JSON.parse(req.body.data);
  console.log(data)

  var stat = data[0].station;
  var usimno = data[0].usimno;
  var phoneno = data[0].phoneno;
  var desc = data[0].desc;

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
        "insert into usim (STATION, USIMNO, PHONENO, DESCRIPTION, STATE) VALUES('"+stat+"', '"+usimno+"', '"+phoneno+"',  '"+desc+"', 0)",
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          connection.commit(function(err){
            if(err){
              res.send("실패했습니다.");
              return;
            }
          });
          res.redirect('/usim');
        });
    });
});

router.post('/commit', function(req, res, next){
  var editdata = JSON.parse(req.body.data);
  console.log(editdata);
  var i = 0;
  var len = editdata.length;
  var flag = false;
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
        console.log(editdata[i]);
        var t_id = editdata[i].id;
        var t_stat = editdata[i].station;
        var t_usimno = editdata[i].usimno;
        var t_phoneno = editdata[i].phoneno;
        var t_desc = editdata[i].desc;
        var t_state = editdata[i].state;

        if(t_id!=null){
          t_state=t_state[1];
          connection.execute(
            "UPDATE USIM set station='"+t_stat+"', usimno='"+t_usimno+"', phoneno='"+t_phoneno+"', description='"+t_desc+"', state='"+t_state+"' where usimidx='"+t_id+"'",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              connection.commit(function(err){
                if(err){
                  res.send("실패했습니다.");
                  flag = true;
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
            "update usim set state=2 where state=0 and usimidx='"+t_id+"'",  // bind value for :id
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
  if(!flag)
    res.send('success');
});

module.exports = router;
