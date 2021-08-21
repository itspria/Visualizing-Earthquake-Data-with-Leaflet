//url for the earthquake data
//url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

//Creating the map object
var myMap = L.map("map", {   
    center: [15.5994, -28.6731], 
    zoom: 3
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function GetColor(depth)
{
   console.log("Depth",depth)
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

// Getting our GeoJSON data
d3.json(url).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) 
        {         
            console.log(feature);
            var color = GetColor(feature.geometry.coordinates[2]);
            return L.circle(latlng, {
                fillOpacity: 0.7, 
                color: color,
                weight: 1,               
                fillColor: color,
                radius: feature.properties.mag * 30000}).bindPopup(`<h3>${feature.properties.title}</h3><hr><I>Magnitude: ${feature.properties.mag}</I><br><I>Depth: ${feature.geometry.coordinates[2]}</I>`) ;  
        }}).addTo(myMap);

        //TODO - Add legend
  });
  