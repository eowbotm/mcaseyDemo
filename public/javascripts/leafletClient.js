//var L = require('leaflet');

L.Icon.Default.imagePath = 'http://leafletjs.com/dist/images';

window.onload = function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'map';

    var DC_COORDS = [38.914268, -77.021098];
    var map = L.map(div).setView(DC_COORDS, 13);

    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var popup = L.popup();
    map.on('click', onMapClick);

	var layer;
	$.get('api/features', function(data){
		layer = L.geoJson(data, {
			onEachFeature: onEachFeature
		}).addTo(map);
	});
	
    // Initialize the layer with no features; the request below will be used to populate it.
   

    // The request package added 3/4 MB to my client.js, so it's back to using this ugly thing.
    //layer.addData(JSON.parse('api/features'));

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(createForm(e))
            .openOn(map);
    }
};

function createForm(e) {
    var html =
        '<div><form method=\"post\" action=\"/api/features\" enctype=\"x-www-form-urlencoded\"><div><span>Name:</span><input type=\"text\" name=\"name\" autofocus=\"autofocus\"></div><div><span>Latitude:</span><input type=\"text\" name=\"lat\" value=\"' +
        e.latlng.lat +
        '\"></div><div><span>Longitude:</span><input type=\"text\" name=\"lon\" value=\"' +
        e.latlng.lng +
        '\"></div><div><input type=\"submit\" value=\"Submit\"></div></form></div>';
    return html;
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}