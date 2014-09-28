var express = require('express');
var router = express.Router();

router.get('/events', function(req, res)  {
	var db = req.db;
	var collection = db.get('events');
	collection.find({},{},function(e,docs){
		res.send(docs);
    });
});

router.post('/events', function(req, res)	{
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
