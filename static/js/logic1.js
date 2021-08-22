// Visualizing-Data-with-Leaflet - logic.js

// Earthquakes & Tectonic Plates GeoJSON URL Variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//Creating the map object
var myMap = L.map("map", {   
    center: [15.5994, -28.6731], 
    zoom: 3
  });
  var tectonicGrp = new L.LayerGroup();
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Getting our GeoJSON data
d3.json(url).then(function(data) {
    L.geoJson(data, {
            color: "darkorange",
            weight: 4
        }).addTo(tectonicGrp);
        // Add tectonicPlates Layer to the Map
        tectonicGrp.addTo(myMap)

});