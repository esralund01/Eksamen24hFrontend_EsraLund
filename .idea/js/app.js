document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('nav button');
    const sections = document.querySelectorAll('section');

    // Tab-switching
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');

            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Initial load of data for each section
    if (typeof loadSirens === "function") loadSirens();
    if (typeof loadFires === "function") loadFires();
});
