var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET Calendar page. */
router.get('/calendar', function(req, res) {
	
    res.render('calendar', { title: 'Calendar' })
});

/* GET Calendar page. */
router.get('/maps', function(req, res) {
    res.render('map', { 
		title: 'Map'
	})
});

module.exports = router;
