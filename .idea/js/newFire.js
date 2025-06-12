document.getElementById('newFireForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const latitude = parseFloat(document.getElementById('lat').value);
    const longitude = parseFloat(document.getElementById('lon').value);

    fetch('http://localhost:8080/fires/'
        , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            position: { latitude, longitude },
            active: true
        })
    })
        .then(() => window.location.href = "index.html");
});
