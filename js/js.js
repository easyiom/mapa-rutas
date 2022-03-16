var locExis;
$(document).ready(function() {
    // $(".owl-carousel").owlCarousel();
    ////Configuracion mapa
    map = L.map('map').setView([41.387668151941625, 2.1853189417337364], 16);
    //buscar ubicacion
    map.locate({})
    var popup = L.popup();
    layerg = L.layerGroup();
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);
    //anhadir el plugin de geolocalizacion
    map.on('locationfound', function(ev) {
        if (locExis == false) {
            locExis = true;
        }
        ubicacionUser = ev.latlng;
        //console.log(ubicacionUser)
    });
    L.control.locate().addTo(map);
    //LEER EL JSON DE LAS UBICACIONES ubis.json y meterlas en la layer de marcadores
    mostrar();
    //localizarse
});

//LEER EL JSON DE LAS UBICACIONES ubis.json y meterlas en la layer de marcadores
function mostrar() {
    $.getJSON('./json/ubis.json', function(data) {
        sitios = data[0];
        sitios.forEach(function(sitio, index) {
            var geoubi;
            if (sitios.id_tipo_fk) {}
            if (!(sitio.coordenadas_lugar == "" || sitio.coordenadas_lugar == undefined || sitio.coordenadas_lugar == "undefined")) {
                let lati = sitio.coordenadas_lugar.split(",")[0],
                    longi = sitio.coordenadas_lugar.split(",")[1],
                    ubiCom = sitio.coordenadas_lugar,
                    ubiCom2 = [41.40724786200179, 2.153372584184284];
                marcador = L.marker([lati, longi], {
                    icon: icono1
                }).bindPopup(`
                <div><img src="" alt=""></div>
                <div>Nombre del lugar: ${sitio.nombre_lugar}</div>
                
                <div onclick="hacerRuta([${lati},${longi}], [${ubicacionUser.lat} , ${ubicacionUser.lng}])"><button>Iniciar ruta</button></div>
                `);
                layerg.addLayer(marcador)
            } else {
                L.esri.Geocoding.geocode({ apikey: 'AAPK350e1a99963349a88d3aaa45c82978a33K6PhhjYv7Q6FDL5zegDREzmt2fW7_niV_r8kWkM32wRvWUBpuPA55TBlU6TkOZf' }).text(sitio.direccion_lugar).run(function(err, results, response) {
                    if (err) { console.log(err); }
                    geoubi = results;
                    var lat = results.results[index].latlng.lat,
                        long = results.results[index].latlng.lng;
                    var ubiCom = lat + "," + long,
                        ubiCom2 = "41.40724786200179, 2.153372584184284";
                    marcador = L.marker([lat, long], {
                        icon: icono1
                    }).bindPopup(`
                    <div><img src="" alt=""></div>
                    <div>Nombre del lugar: ${sitio.nombre_lugar}</div>
                    <div onclick="hacerRuta([${lat},${long}], [${ubicacionUser.lat} , ${ubicacionUser.lng}])"><button>Iniciar ruta</button></div>
                    `);
                    layerg.addLayer(marcador)
                });
            }
        })
        layerg.addTo(map);
    });
}



//poner los iconos correspondientes
const icono1 = L.divIcon({
    html: '<i class="fas fa-books"></i>',
    iconSize: [20, 20],
    className: 'iconoMapa'
});

//crear la ruta
routingControl = undefined;

function hacerRuta(punto, geoloc) {
    if (routingControl !== undefined) {
        map.removeControl(routingControl)
    }
    console.log(punto);
    console.log(geoloc);
    routingControl = L.Routing.control({
        draggableWaypoints: false,
        createMarker: function() { return null; },
        waypoints: [
            L.latLng(punto),
            L.latLng(geoloc)
        ],
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: false,
    }).addTo(map);
}