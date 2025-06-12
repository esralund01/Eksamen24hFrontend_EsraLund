const sirensTableBodyId = 'sirensTableBody';

document.addEventListener('DOMContentLoaded', loadSirens);

console.log('sirens.js er loaded');

async function loadSirens() {
    console.log('loadSirens kaldt');

    const section = document.getElementById('sirens');
    section.classList.add('active');

    if (!section) {
        console.error('Element med id="sirens" ikke fundet!');
        return;
    }

    section.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Status (Active)</th>
                    <th>Disabled</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody id="${sirensTableBodyId}"></tbody>
        </table>
        <h3>Create new siren</h3>
        <form id="createSirenForm">
            <label>Latitude: <input type="number" step="any" id="sirenLat" required></label><br/>
            <label>Longitude: <input type="number" step="any" id="sirenLon" required></label><br/>
            <label>Active: <input type="checkbox" id="sirenActive" checked></label><br/>
            <label>Disabled: <input type="checkbox" id="sirenDisabled"></label><br/>
            <button type="submit" class="btn-primary">Create Siren</button>
        </form>`;

    const sirensTableBody = document.getElementById(sirensTableBodyId);
    if (!sirensTableBody) {
        console.error('Element med id="sirensTableBody" ikke fundet!');
        return;
    }

    try {
        const res = await fetch('http://localhost:8080/sirens');
        console.log('Fetch status:', res.status);
        if (!res.ok) throw new Error('Network response was not ok');

        const sirens = await res.json();
        console.log('Sirens data:', sirens);

        sirensTableBody.innerHTML = '';
        if (!Array.isArray(sirens) || sirens.length === 0) {
            sirensTableBody.innerHTML = '<tr><td colspan="5">No sirens found</td></tr>';
            return;
        }

        sirens.forEach(siren => {
            // Tjek om position findes
            if (!siren.position || typeof siren.position.latitude !== 'number' || typeof siren.position.longitude !== 'number') {
                console.warn('Siren har ikke gyldig position:', siren);
                return;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${siren.position.latitude.toFixed(5)}</td>
                <td>${siren.position.longitude.toFixed(5)}</td>
                <td>${siren.active ? 'Yes' : 'No'}</td>
                <td>${siren.disabled ? 'Yes' : 'No'}</td>
                <td>
                    <button onclick="editSiren(${siren.id})" class="btn-secondary">Edit</button>
                    <button onclick="deleteSiren(${siren.id})" class="btn-danger">Delete</button>
                </td>`;
            sirensTableBody.appendChild(tr);
        });
    } catch(e) {
        sirensTableBody.innerHTML = '<tr><td colspan="5">Error loading sirens</td></tr>';
        console.error('Error:', e);
    }

    const createForm = document.getElementById('createSirenForm');
    if (createForm) {
        createForm.addEventListener('submit', createSiren);
    } else {
        console.error('Element med id="createSirenForm" ikke fundet!');
    }
}

async function createSiren(e) {
    e.preventDefault();

    const latInput = document.getElementById('sirenLat');
    const lonInput = document.getElementById('sirenLon');
    const activeInput = document.getElementById('sirenActive');
    const disabledInput = document.getElementById('sirenDisabled');

    if (!latInput || !lonInput || !activeInput || !disabledInput) {
        alert('Form inputs ikke fundet!');
        return;
    }

    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    const active = activeInput.checked;
    const disabled = disabledInput.checked;

    if (isNaN(lat) || isNaN(lon)) {
        alert('Latitude og Longitude skal være tal');
        return;
    }

    const sirenData = {
        position: { latitude: lat, longitude: lon },
        active,
        disabled,
        lastUsed: new Date().toISOString()
    };

    try {
        const res = await fetch('http://localhost:8080/sirens', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sirenData)
        });
        if (!res.ok) throw new Error('Error creating siren');

        document.getElementById('createSirenForm').reset();
        await loadSirens();
        alert('Siren successfully created!');
    } catch(err) {
        alert(err.message);
    }
}

async function deleteSiren(id) {
    if (!confirm('Are you sure you want to delete this siren?')) return;
    try {
        const res = await fetch(`http://localhost:8080/sirens/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error deleting siren');
        await loadSirens();
    } catch (err) {
        alert(err.message);
    }
}

async function editSiren(id) {
    const lat = prompt('Enter new latitude:');
    const lon = prompt('Enter new longitude:');
    const active = confirm('Is the siren active? OK=Yes, Cancel=No');
    const disabled = confirm('Is the siren disabled? OK=Yes, Cancel=No');

    if (!lat || !lon) return alert('Latitude and longitude must be entered');

    const sirenData = {
        position: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
        active,
        disabled,
        lastUsed: new Date().toISOString()
    };

    try {
        const res = await fetch(`http://localhost:8080/sirens/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sirenData)
        });
        if (!res.ok) throw new Error('Error updating siren');
        await loadSirens();
        alert('Siren successfully updated!');
    } catch(err) {
        alert(err.message);
    }
}
