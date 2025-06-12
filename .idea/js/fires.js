document.addEventListener('DOMContentLoaded', async() => {
    const list = document.getElementById('fireList');

    try {
        const res = await fetch('http://localhost:8080/fires/active');
        if (!res.ok) throw new Error('Failed to load fires');
        const fires = await res.json();

        list.innerHTML = '';

        if (fires.length === 0) {
            list.textContent = 'No active fires';
            return;
        }

        fires.forEach(fire => {
            const item = document.createElement('li');
            item.dataset.fireId = fire.id;
            item.textContent = `Fire #${fire.id} – ${fire.position.latitude.toFixed(5)}, ${fire.position.longitude.toFixed(5)}`;


            const btn = document.createElement('button');
            btn.textContent = '🧯 Close fire';
            btn.classList.add('btn-secondary');

            btn.addEventListener('click',async () => {
            try {
                await window.deleteFire(fire.id);
                item.remove();

                if (list.children.length === 0) {
                    list.textContent = 'No active fires';
                }
            } catch (err) {
                alert("Could not close fire: " + err.message);
            }
            });
            item.appendChild(btn);
            list.appendChild(item);
        });
    } catch (err) {
        alert(`Couldnt fetch fires`);
        console.log(err);
    }
});
