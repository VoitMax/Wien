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
            console.log(geoJsonPoint.properties.NAME);
            let popup = `
                <img src="${geoJsonPoint.properties.THUMBNAIL}"
                alt=""><br>
                <strong>${geoJsonPoint.properties.NAME}</strong>
                <hr>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEITERE_INF}
                ">Weblink</a>
            `;

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16,37],
                    popupAnchor: [0,-37]
                })
            }).bindPopup(popup); 
        }

    }).addTo(overlay);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


// Haltestellen
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Haltestellen Vienna Sightseeing");
    overlay.addTo(map)
    L.geoJSON(geojson,{
        pointToLayer: function(geoJsonPoint,latlng){
            console.log(geoJsonPoint.properties.NAME);
            let popup = `
                <strong>${geoJsonPoint.properties.LINE_NAME}</strong><br>
                Station ${geoJsonPoint.properties.STAT_NAME}

            `;

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16,37],
                    popupAnchor: [0,-37]
                })
            }).bindPopup(popup); 
        }

    }).addTo(overlay);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


// Unterkünfte
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Hotels");
    overlay.addTo(map)
    L.geoJSON(geojson, {
        pointToLayer: function(geoJsonPoint,latlng){
            console.log(geoJsonPoint.properties.NAME);
            let popup = `
                
                <strong>${geoJsonPoint.properties.BETRIEB}</strong>
                <hr>
                Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
                Kategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
                Tel.-Nr. ${geoJsonPoint.properties.KONTAKT_TEL}<br>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEBLINK1}
                ">Weblink</a><br>
                <a href="mailto:${geoJsonPoint.properties.KONTAKT_EMAIL}
                ">E-Mail</a>
            `;
            if (geoJsonPoint.properties.BETRIEBSART == "H") {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_0star.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            } else if (geoJsonPoint.properties.BETRIEBSART == "P") {
                return L.marker(latlng, {
                    icon: L.icon({ 
                        iconUrl: "icons/lodging_0star.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/apartment-2.png",
                        iconAnchor: [16,37],
                        popupAnchor: [0,-37]
                    })
                }).bindPopup(popup);
            }
             
        }

    }).addTo(overlay);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")


async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Liniennetz Vienna Sightseeing");
    overlay.addTo(map)
    L.geoJSON(geojson, {
        style: function(feature) {
            let colors = {
                "Red Line" : "#FF4136",
                "Yellow Line": "#FFDC00",
                "Blue Line": "#0074D9", 
                "Green Line": "#2ECC40",
                "Grey Line": "#AAAAAA",
                "Orange Line": "#FF851B"
            };

            return {
                color: `${colors[feature.properties.LINE_NAME]}`,
                weight: 4,
                dashArray: [10, 6]

            } 
        }
    }).bindPopup(function (layer) {
        return `
            <h4>${layer.feature.properties.LINE_NAME}</h4>
            von: ${layer.feature.properties.FROM_NAME}
            <br>
            nach: ${layer.feature.properties.TO_NAME}
        `;
        //return layer.feature.properties.LINE_NAME;
    }).addTo(overlay);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Fußgängerzonen
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    console.log(geojson);
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay,"Fußgängerzonen Wien");
    overlay.addTo(map)

    L.geoJSON(geojson, {
        style: function(feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.1,
                fillopacity: 0.1
            }
        }
    }).bindPopup(function (layer) {
        return `
        <h4>${layer.feature.properties.ADRESSE}</h4>
        <p>${layer.feature.properties.ZEITRAUM || "24/7"}</p>
        <p>${layer.feature.properties.AUSN_TEXT || "Goanix"}</p>
        `;
        
    }).addTo(overlay);
}

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


