class Grid {
    constructor(tamanoCelda) {
        this.tamanoCelda = tamanoCelda;
        this.celdas = {};
    }

    _obtenerClaveCelda(latitud, longitud) {
        const fila = Math.floor(latitud / this.tamanoCelda);
        const columna = Math.floor(longitud / this.tamanoCelda);
        return `${fila}_${columna}`;
    }

    agregarRestaurante(restaurante) {
        const claveCelda = this._obtenerClaveCelda(restaurante.latitud, restaurante.longitud);
        if (!this.celdas[claveCelda]) {
            this.celdas[claveCelda] = [];
        }
        this.celdas[claveCelda].push(restaurante);
    }

    buscarRestaurantesCercanos(latitud, longitud, rango) {
        const resultados = [];
        const filaCentral = Math.floor(latitud / this.tamanoCelda);
        const columnaCentral = Math.floor(longitud / this.tamanoCelda);
        const rangoCeldas = Math.ceil(rango / this.tamanoCelda);

        for (let i = filaCentral - rangoCeldas; i <= filaCentral + rangoCeldas; i++) {
            for (let j = columnaCentral - rangoCeldas; j <= columnaCentral + rangoCeldas; j++) {
                const claveCelda = `${i}_${j}`;
                if (this.celdas[claveCelda]) {
                    resultados.push(...this.celdas[claveCelda]);
                }
            }
        }

        return resultados.filter(restaurante => {
            const distancia = this._calcularDistancia(latitud, longitud, restaurante.latitud, restaurante.longitud);
            return distancia <= rango;
        });
    }

    buscarRestauranteMasCercano(latitud, longitud) {
        const todosRestaurantes = Object.values(this.celdas).flat();
        let masCercano = null;
        let distanciaMinima = Infinity;

        todosRestaurantes.forEach(restaurante => {
            const distancia = this._calcularDistancia(latitud, longitud, restaurante.latitud, restaurante.longitud);
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                masCercano = restaurante;
            }
        });

        return masCercano;
    }

    _calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this._gradosARadianes(lat2 - lat1);
        const dLon = this._gradosARadianes(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this._gradosARadianes(lat1)) * Math.cos(this._gradosARadianes(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en km
    }

    _gradosARadianes(grados) {
        return grados * (Math.PI / 180);
    }
}
