var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TigerDB' });
});

router.get('/home', function(req, res, next){
  var progress_values = [{name:"test1", value:30}, {name:"test2", value:44}, {name:"test3", value:100}, {name:"test4", value:73}];
  var notice_values = ["title1", "title2", "title3"];
  res.render('home', {progress_values:progress_values, notice_values:notice_values});
});

router.get('/signup', function(req, res, next){
  res.render('signup');
});

router.get('/phone', function(req, res, next){
  res.render('phone');
});

router.get('/profile', function(req, res, next){
  res.render('profile');
});

router.get('/test', function(req, res, next){
  res.render('test');
});

router.get('/notice', function(req, res, next){
  var notice_values=[{title:"title1", content:"It's title1's content (content1)"},
                    {title:"title2", content:"It's title2's content (content2)"},
                    {title:"title3", content:"It's title1's content (content3)"}];
  res.render('notice', {notice_values:notice_values});
});

module.exports = router;
