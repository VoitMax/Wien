/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.2085,
    lng: 16.373,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 12,
    layers: [
        startLayer
    ]

});

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT Orthophoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Beschriftungen": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap mit Orthofoto und Beschriftungen": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay"),
    ])
}).addTo(map);

layerControl.expand(); 

let sightLayer = L.featureGroup();

let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

sightLayer.addTo(map);

// Maßstab hinzugefügt
L.control.scale({
    imperial: false,
}).addTo(map);

L.control.fullscreen().addTo(map);


let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT")
).addTo(map);

// Sehenswürdigkeiten 
async function loadSights(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Sehenswürdigkeiten");
    overlay.addTo(map);

    L.geoJSON(geojson,{
        pointToLayer: function(geoJsonPoint,latlng){
            return L.marker(latlng); 
        }

    }).addTo(overlay);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Haltestellen Vienna Sightseeing");
    overlay.addTo(map)
    L.geoJSON(geojson).addTo(overlay);
}
//loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Liniennetz Vienna Sightseeing");
    overlay.addTo(map)
    L.geoJSON(geojson).addTo(overlay);
}

//loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Fußgängerzonen Wien");
    overlay.addTo(map)
    L.geoJSON(geojson).addTo(overlay);
}

//loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Hotels");
    overlay.addTo(map)
    L.geoJSON(geojson).addTo(overlay);
}

//loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")


