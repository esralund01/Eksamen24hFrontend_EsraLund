var map = L.map('map').setView([34.05, -118.25], 11); // LA centrum

var fireMarkers = {};
var sirenMarkers = {};  // id -> marker

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function toRad(val) { return val * Math.PI / 180; }
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function clearFireMarkers() {
    Object.values(fireMarkers).forEach(marker => {
        map.removeLayer(marker);
    });
    for (const id in fireMarkers) {
        delete fireMarkers[id];
    }
}

function updateSirensStatus(fires) {
    // Gå alle sirener igennem og tjek om nogen brand er nær
    Object.values(sirenMarkers).forEach(marker => {
        const sirenLatLng = marker.getLatLng();
        let isActive = fires.some(fire => {
            return haversine(
                fire.position.latitude, fire.position.longitude,
                sirenLatLng.lat, sirenLatLng.lng
            ) <= 10; // indenfor 10 km
        });

        if (isActive) {
            marker.setStyle({ color: 'green', radius: 10 });
            marker.bindPopup(`Activated Siren ID: ${marker.options.id}`).openPopup();
        } else {
            marker.setStyle({ color: 'red', radius: 8 });
            marker.bindPopup(`Siren ID: ${marker.options.id}`);
        }
    });
}

// Load sirener og gem markører
function loadSirensAndFires() {
    fetch('http://localhost:8080/sirens')
        .then(res => res.json())
        .then(sirens => {
            sirens.forEach(siren => {
                const marker = L.circleMarker([siren.position.latitude, siren.position.longitude], {
                    color: 'red',
                    radius: 8,
                    id: siren.id
                }).addTo(map).bindPopup("Siren ID: " + siren.id);

                sirenMarkers[siren.id] = marker;
            });

            // Når sirener er loadet, hent brande og vis dem
            fetch('http://localhost:8080/fires/active')
                .then(res => res.json())
                .then(fires => {
                    clearFireMarkers();

                    fires.forEach(fire => {
                        const marker = L.marker([fire.position.latitude, fire.position.longitude], {
                            icon: L.divIcon({className: 'fire-emoji', html: '🔥', iconSize: [40, 40]})
                        }).addTo(map);

                        fireMarkers[fire.id] = marker;
                    });

                    // Opdater sirener baseret på *alle* brande samlet
                    updateSirensStatus(fires);
                });
        });
}
loadSirensAndFires();

async function deleteFire(id) {
    try {
        console.log("Trying to delete fire with id:", id);

        const res = await fetch(`http://localhost:8080/fires/${id}/closure`, {
            method: 'DELETE'
        });

        if (res.ok) {
            if (fireMarkers[id]) {
                //remove fire emoji
                map.removeLayer(fireMarkers[id]);
                delete fireMarkers[id];
            }

            // Opdater listen af brande i DOM
            const list = document.getElementById('fireList');
            if (list) {
                const item = list.querySelector(`li[data-fire-id="${id}"]`);
                if (item) item.remove();

                if (list.children.length === 0) {
                    list.textContent = 'No active fires';
                }
            }

            // Opdater sirener baseret på aktive brande
            const firesRes = await fetch('http://localhost:8080/fires/active');
            const fires = await firesRes.json();
            updateSirensStatus(fires);
        } else {
            alert("Failed to delete fire");
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

//make funktion global, so fires.js can use it
window.deleteFire = deleteFire;

