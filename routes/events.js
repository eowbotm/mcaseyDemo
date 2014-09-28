var express = require('express');
var router = express.Router();

router.route('/events')
	.all(function(req, res, next) {
		req.events = req.db.get('events');
		next();
	})
	
	.get(function(req, res, next)  {
		var events = req.events;
		events.find({},{},function(e,docs){
			res.send(docs);
		});
	})

	.post(function(req, res, next)	{
		var events = req.events;
		
		var eventName = req.body.title;
		var eventStart = req.body.start;
		var eventEnd = req.body.end;
		var eventColor = req.body.color;
		
		
		events.insert({
			"title" : eventName,
			"start" : eventStart,
			"end" : eventEnd,
			"color" : eventColor
			}, function(err, doc)	{
				if(err){
					res.send("Problem adding event to database");
				}
				else{
					res.status(200).send(doc);
				}
			}
			
		);
	})
	
	.delete(function(req, res, next)	{
		var eventID = req.body.id;
		if (!eventID.isEmpty || eventID.isEmpty()) {
            res.send("Invalid id: must be a non-blank string.");
		}
		else { // Valid data, so we can attempt an insert into mongo.
            console.log("deleting event", eventID);
            var toDelete = { "_id": eventID };
			req.events.remove(toDelete, function (err, doc) {
                if (err) next(new Error(err));
                console.log('event deleted successfully.');
				res.status(200).end();
            });
		}
	});

module.exports = router;
