document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    const grid = new Grid(0.01); // Tamaño de la celda en grados

    const restaurantes = [
        new Restaurante(1, "Restaurante A", -15.840221, -70.021880),
        new Restaurante(2, "Restaurante B", -15.838746, -70.019897),
        new Restaurante(3, "Restaurante C", -15.837654, -70.021234),
        new Restaurante(4, "Restaurante D", -15.839789, -70.023456),
    ];

    // Poblar la cuadrícula con los datos de ejemplo
    restaurantes.forEach(restaurante => grid.agregarRestaurante(restaurante));

    // Inicializar el mapa (utilizando Leaflet.js por ejemplo)
    const map = L.map(mapElement).setView([-15.840221, -70.021880], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let personaMarker;

    // Icono personalizado para la persona
    const personaIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [38, 38],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62]
    });

    // Función para agregar un marcador en el mapa
    const agregarMarcador = (lat, lon, nombre) => {
        L.marker([lat, lon]).addTo(map).bindPopup(nombre).openPopup();
    };

    // Función para buscar y mostrar el restaurante más cercano
    const mostrarRestauranteMasCercano = (lat, lon) => {
        const restaurante = grid.buscarRestauranteMasCercano(lat, lon);
        if (restaurante) {
            agregarMarcador(restaurante.latitud, restaurante.longitud, `${restaurante.nombre} (Más cercano)`);
        } else {
            alert('No se encontró ningún restaurante cercano.');
        }
    };

    // Botón de búsqueda
    const buscarBtn = document.getElementById('buscar');
    buscarBtn.addEventListener('click', () => {
        const lat = parseFloat(document.getElementById('latitud').value);
        const lon = parseFloat(document.getElementById('longitud').value);
        actualizarUbicacionPersona(lat, lon);
    });

    // Botón para generar restaurante aleatorio
    const generarBtn = document.getElementById('generar');
    generarBtn.addEventListener('click', () => {
        const lat = -15.84 + Math.random() * 0.02 - 0.01; // Rango cercano a Puno
        const lon = -70.02 + Math.random() * 0.02 - 0.01;
        const nuevoRestaurante = new Restaurante(Date.now(), "Restaurante Aleatorio", lat, lon);
        grid.agregarRestaurante(nuevoRestaurante);
        agregarMarcador(lat, lon, nuevoRestaurante.nombre);
    });

    // Mostrar todos los restaurantes en el mapa
    restaurantes.forEach(restaurante => {
        agregarMarcador(restaurante.latitud, restaurante.longitud, restaurante.nombre);
    });

    // Función para actualizar la ubicación de la persona
    const actualizarUbicacionPersona = (lat, lon) => {
        if (personaMarker) {
            map.removeLayer(personaMarker);
        }
        personaMarker = L.marker([lat, lon], { icon: personaIcon }).addTo(map).bindPopup("Ubicación de la persona").openPopup();
        mostrarRestauranteMasCercano(lat, lon);
    };

    // Evento de clic en el mapa
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        actualizarUbicacionPersona(lat, lng);
    });
});
