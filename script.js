document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- ЛОГИКА ДЛЯ МЕНЮ ---
    const menuButton = document.getElementById('menu-button');
    const menuNav = document.getElementById('menu-nav');

    menuButton.addEventListener('click', () => {
        // Переключаем класс 'show', который делает меню видимым или невидимым
        menuNav.classList.toggle('show');
    });

    // Закрываем меню, если кликнуть в любом другом месте экрана
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuNav.contains(event.target)) {
            menuNav.classList.remove('show');
        }
    });


    // --- ЛОГИКА ДЛЯ ГРЯДОК (остается без изменений) ---
    const availableBeds = document.querySelectorAll('.garden-bed.available');

    availableBeds.forEach(bed => {
        bed.addEventListener('click', () => {
            if (bed.innerHTML !== '') {
                return;
            }

            const plant = document.createElement('div');
            plant.classList.add('plant');
            plant.innerText = '🌱';
            bed.appendChild(plant);

            setTimeout(() => {
                plant.innerText = '🥕';
                
                plant.addEventListener('click', (e) => {
                    e.stopPropagation();
                    bed.innerHTML = '';
                    tg.HapticFeedback.notificationOccurred('success');
                }, { once: true });

            }, 5000);
        });
    });
});
