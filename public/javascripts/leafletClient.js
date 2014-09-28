
var map;
var selectedFeature;

L.Icon.Default.imagePath = 'http://leafletjs.com/dist/images';

window.onload = function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'map';

    var DC_COORDS = [38.914268, -77.021098];
    map = L.map(div).setView(DC_COORDS, 13);

    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var popup = L.popup();
    map.on('click', onMapClick);

	$.get('api/features', function(data){
		L.geoJson(data, {
			onEachFeature: onEachFeature
		}).addTo(map);
	});

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(createForm(e))
            .openOn(map);
    }
};

function onClick(e) {
		selectedFeature = e.target;
	}

function createForm(e) {
    var html =
        '<div><form id=featureForm enctype=\"x-www-form-urlencoded\"><div><span>Name:</span><input type=\"text\" name=\"name\" autofocus=\"autofocus\"></div><div><span>Latitude:</span><input type=\"text\" name=\"lat\" value=\"' +
        e.latlng.lat +
        '\"></div><div><span>Longitude:</span><input type=\"text\" name=\"lon\" value=\"' +
        e.latlng.lng +
        '\"></div><div><input type=\"button\" onclick="formSubmitted()" value=\"Submit\" /></div></form></div>';
    return html;
}

function createPopup(name, layer) {
	var html = '<b>' + name + '</b>';
	html += '<div><input type=\"button\" value="X" onclick=\"deleteFeature()\"/></div>';
	layer.bindPopup(html);
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name) {
        createPopup(feature.properties.name, layer);
		layer.on({
			click: onClick
		});
    }
	
}

function formSubmitted(){
	var src = document.forms.featureForm;
	var data = {
		name: src[0].value,
		lat: src[1].value,
		lon: src[2].value
		};
	$.post("/api/features", data, function(data){
			if(true) {//if successful
				
				addGraphicalFeature(data.name, data.lat, data.lon, data._id);
			}
		//handle errors
		});
	
}

function addGraphicalFeature(name, lat, lon, id) {
	var layer = L.marker([lat,lon]);
	
	var feature = new Object();
	feature.properties = {"_id": id};
	feature.geometry = new Object();
	feature.geometry.coordinates = [lat,lon];
	
	layer.feature = feature;
	
	createPopup(name, layer);
	layer.addTo(map).openPopup();
	layer.on({
			click: onClick
		});
		
	selectedFeature = layer;
}

function deleteFeature() {
	$.ajax({
		url:	"/api/features",
		type: "DELETE",
		data: {id: selectedFeature.feature.properties._id},
		success: function(result) {
			map.removeLayer(selectedFeature);
		}
	});
}