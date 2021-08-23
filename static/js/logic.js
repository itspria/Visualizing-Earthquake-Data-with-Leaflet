//url for the earthquake data

url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
var tectonicurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  
// Adding the layer groups
var earthquakeGrp = new L.LayerGroup();
var tectonicGrp = new L.LayerGroup();

//Adding different base layers
var mapLite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "light-v9",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "outdoors-v9",
    accessToken: API_KEY
});

var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
     "Grayscale": mapLite,
     "Outdoors": outdoorsMap,     
     "Satellite": satMap
 };
 
 // Create Overlay Object to Hold Overlay Layers
 var overlayMaps = {
     "Earthquakes": earthquakeGrp,
     "Fault Lines": tectonicGrp
 };

//Creating the map object
var myMap = L.map("map", {   
     center: [15.5994, -28.6731], 
     zoom: 3,
     layers: [mapLite, earthquakeGrp]
   });

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

function GetColor(depth)
{   
   if (depth > 90)
        return 'red';  
   else if (depth > 70)   
        return 'coral';
   else if (depth > 50)
        return 'orange';
   else if (depth > 30)   
        return 'gold';
   else if (depth > 10)
        return 'yellow';
   else
       return 'greenyellow';
    
}
var legend = L.control({position: 'bottomleft'});

// Getting GeoJSON earthquakes data
d3.json(url).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) 
        {   
            
            var color = GetColor(feature.geometry.coordinates[2]);
            return L.circle(latlng, {
                fillOpacity: 0.7, 
                color: 'grey',
                weight: 1,               
                fillColor: color,
                radius: feature.properties.mag * 30000}).bindPopup(`<h3>${feature.properties.title}</h3><hr><I>Magnitude: ${feature.properties.mag}</I><br><I>Depth: ${feature.geometry.coordinates[2]}</I>`) ;  
        }}).addTo(earthquakeGrp);
          
     
          legend.onAdd = function(map) {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h3>Depth Categories</h3><hr>";
          div.innerHTML += "<i style='background: greenyellow'></i><span>Less than 10</span><p>";
          div.innerHTML += "<i style='background: yellow'></i><span>10-30</span><p>";
          div.innerHTML += "<i style='background: gold'></i><span>30-50</span><p>";
          div.innerHTML += "<i style='background: orange'></i><span>50-70</span><p>";
          div.innerHTML += "<i style='background: coral'></i><span>70-90</span><p>";
          div.innerHTML += "<i style='background: red'></i><span>Greater than 90</span><br>";
          return div;
        };
     
     legend.addTo(myMap);
     earthquakeGrp.addTo(myMap);
   
  });

//Events to show/hide legend
myMap.on('overlayadd', function(eventLayer){
     console.log("ADD", eventLayer.name)
     if (eventLayer.name === 'Earthquakes'){
         myMap.addControl(legend);
     } 
 });
 
myMap.on('overlayremove', function(eventLayer){
     console.log("Remove", eventLayer.name)
     if (eventLayer.name === 'Earthquakes'){
          myMap.removeControl(legend);
     } 
 });
  
// Retrieve Tectonic Plates 
d3.json(tectonicurl).then(function(data) {
     
    // Create a GeoJSON Layer the plateData
    L.geoJson(data, {
        color: "darkorange",
        weight: 3
    // Add tectonic plates to LayerGroups 
    }).addTo(tectonicGrp);
    // Add tectonic plates layer to the Map
    //tectonicGrp.addTo(myMap)
});


