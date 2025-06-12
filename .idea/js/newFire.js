document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newFireForm');
    if (!form) {
        console.error("🔥 Form not found!");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const latitude = parseFloat(document.getElementById('lat').value);
        const longitude = parseFloat(document.getElementById('lon').value);

        try {
            const res = await fetch('http://localhost:8080/fires', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    position: { latitude, longitude },
                    active: true
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server error: ${errorText}`);
            }

            alert("🔥 Fire created!");
            window.location.href = "index.html";
        } catch (err) {
            console.error("Error:", err);
            alert("Could not create fire.");
        }
    });
});
