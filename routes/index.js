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

router.get('/events', function(req, res)  {
	var db = req.db;
	var collection = db.get('events');
	collection.find({},{},function(e,docs){
		res.send(docs);
    });
});

router.post('/addevent', function(req, res)	{
	var db = req.db;
	
	var eventName = req.body.title;
	var eventStart = req.body.start;
	var eventEnd = req.body.end;
	var eventColor = req.body.color;
	
	var collection = db.get('events');
	collection.insert({
		"title" : eventName,
		"start" : eventStart,
		"end" : eventEnd,
		"color" : eventColor
		}, function(err, doc)	{
			if(err){
				res.send("Problem adding event to database");
			}
		
	});
});

module.exports = router;
