var express = require('express');
var router = express.Router();
var geojson = require('geojson');

router.route('/features')
.all(function(req, res, next) {
        // This is fantastic; monk seems to cache the connection as every time this runs after the first
        // is an order of magnitude less than the first time (~200 ms to ~20 ms).
        //req.features = require('monk')('mongodb://@localhost:27017/test').get('features');
        req.features = require('monk')('mongodb://bitgrid:eWI2ASJGwLcn@ds059509.mongolab.com:59509/bitgrid-database').get('features');
        console.log(req.body);
        next();
    })
	
.get(function(req, res, next) {
        // Find all documents in the features collection.
        req.features.find({},{}, function(e, docs) {
            geojson.parse(docs, {Point: ['lat', 'lon']}, function(parsed) {
                res.send(parsed);
            });
        });
    })
.post(function(req, res, next) {
        // This is more to be helpful to users of a REST client like Postman who forget to set Content-Type.
        //if (req.headers["content-type"].toLowerCase() != "application/x-www-form-urlencoded") {
        //    console.log(req.headers["content-type"]);
        //    res.send("Invalid Content-Type: must be application/x-www-form-urlencoded");
        //    return;
        //}

        var name = req.body.name;
        var lat = Number(req.body.lat);
        var lon = Number(req.body.lon);
		
        if (!name.isEmpty || name.isEmpty()) {
            res.send("Invalid name: must be a non-blank string.");
        }
        else if (!isLat(lat) || !isLon(lon)) {
            res.send("Invalid lat/lon: latitude must be within -90 and 90 while longitude must be within -180 and 180.");
        }
        else { // Valid data, so we can attempt an insert into mongo.
            console.log("inserting feature", name, lat, lon);
            var toInsert = { name: name, lat: lat, lon: lon };
            req.features.insert(toInsert, function (err, doc) {
                if (err) next(new Error(err));
                console.log('feature committed successfully.');
				res.status(200).send(doc);
            });
        }
    })
.delete(function(req, res, next) {
		var id = req.body.id;
		if (!id.isEmpty || id.isEmpty()) {
            res.send("Invalid id: must be a non-blank string.");
		}
		else { // Valid data, so we can attempt an insert into mongo.
            console.log("deleting feature", id);
            var toDelete = { "_id": id };
            req.features.remove(toDelete, function (err, doc) {
                if (err) next(new Error(err));
                console.log('feature deleted successfully.');
				res.status(200).end();
            });
        }
	});

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function isLat(lat) {
    if (isNaN(lat)) return false;
    var asNumber = Number(lat);
    return asNumber < 90 && asNumber > -90;
}

function isLon(lon) {
    if (isNaN(lon)) return false;
    var asNumber = Number(lon);
    return asNumber < 180 && asNumber > -180;
}

module.exports = router;