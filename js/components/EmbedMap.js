class EmbedMap extends HTMLElement {
    constructor () {
        super();
    }
    loadLibrary () {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '../../js/leaflet/leaflet.js';
        script.addEventListener('load', (ev) => {
            this.init();
        });
        document.querySelector('head').appendChild(script);
    }
    setLocation (lat, lon) {
        this.location = L.latLng(lat, lon);
    }
    addMarker (lat, lon, overlay) {
        let marker = L.marker([lat, lon]).addTo(this.map);
        if (overlay) {
            marker.bindPopup(overlay);
        }
        this.pins.push(marker);
    }
    removePins () {
        this.pins.forEach( (pin) => {
            pin.remove();
        });
        this.pins = [];
    }
    dropPins () {
        let elements = document.querySelectorAll('[data-latlon]');
        if (elements.length < 1) {
            return;
        }
        let boundary = L.latLngBounds();
        let coords;
        elements.forEach( (element) => {
            coords = element.dataset.latlon.split(',');
            element.marker = this.addMarker(coords[0], coords[1], element.cloneNode(true));
            boundary.extend(L.latLng(coords[0], coords[1]));
        });
        this.map.setView(boundary.getCenter());
        if (elements.length > 1) {
            this.map.fitBounds(boundary);
        }
    }
    updatePins () {
        this.removePins();
        this.dropPins();
    }
    draw () {
        let mapOptions = {
            zoom: this.magnification
        };
        if (!this.map) {
            this.map = L.map(this.querySelector('.map'), mapOptions);
            L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        }
        if (this.location) {
            this.map.setView(this.location);
        }
        if (this.dataset.updates) {
            this.map.on('moveend', (ev) => {
                this.broadcastLocation();
            });
            this.map.on('zoomend', (ev) => {
                this.broadcastLocation();
            });
        }
    }
    broadcastLocation () {
        let detail = {};
        let location = this.map.getCenter();
        detail.latitude = parseFloat(location.lat).toFixed(6);
        detail.longitude = parseFloat(location.lng).toFixed(6);
        detail.zoom = this.map.getZoom();
        const locationUpdate = new CustomEvent('locationUpdate', { bubbles: true, detail: detail });
        document.dispatchEvent(locationUpdate);
    }
    init () {
        if (this.dataset.geolocate) {
            this.querySelector('.map').innerHTML = '<div style="text-align: center"><p>Getting location… please wait.<span class="loader loading"></span></p></div>';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.magnification = 12;
                    this.setLocation(position.coords.latitude, position.coords.longitude);
                    this.draw();
                    this.broadcastLocation();
                },
                (error) => {
                    this.draw();
                }
            );
        }
        if (this.dataset.latitude && this.dataset.longitude) {
            this.setLocation(this.dataset.latitude, this.dataset.longitude);
        }
        this.draw();
        if (this.dataset.marker) {
            this.addMarker(this.dataset.latitude, this.dataset.longitude);
        } else {
            this.dropPins();
            document.addEventListener('updateMarkers', (ev) => {
                this.updatePins();
            });
        }
    }
    connectedCallback () {
        this.innerHTML = '<div class="map"></div>';
        this.magnification = 12;
        if (this.dataset.zoom) {
            this.magnification = this.dataset.zoom;
        }
        this.map = null;
        this.pins = [];
        this.location = null;
        if (window.L) {
            this.init();
        } else {
            this.loadLibrary();
        }
    }
}
customElements.define('embed-map', EmbedMap);