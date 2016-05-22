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
        "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, p.phoneno, p.phonename, p.osver from rent r, employee e, phone p where r.renter=e.empno and r.phone=p.phoneno order by rentdate desc",  // bind value for :id
        function(err, result)
        {
          if (err) { console.error(err.message); return; }
          console.log(result.rows);
          var phonerent=result.rows;
          connection.execute(
            "SELECT r.rentno, r.renter, r.description, r.phone, r.usim, r.rentdate, r.returndate, e.empno, e.empname, u.usimidx, u.usimno from rent r, employee e, usim u where r.renter=e.empno and r.phone=p.phoneno order by rentdate desc",  // bind value for :id
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);
              var usimrent=result.rows;
              res.render('bug', {emp:req.session, phonerents:phonerent, usimrents:usimrent});
            });
        });
    });
});

module.exports = router;
