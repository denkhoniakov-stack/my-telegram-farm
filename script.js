document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- Элементы страницы ---
    const menuButton = document.getElementById('menu-button');
    const menuNav = document.getElementById('menu-nav');
    const seedMenu = document.getElementById('seed-menu');
    const availableBeds = document.querySelectorAll('.garden-bed.available');

    let activeBed = null; // Переменная для хранения грядки, на которую кликнули

    // --- Логика главного меню ---
    menuButton.addEventListener('click', () => {
        menuNav.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuNav.contains(event.target)) {
            menuNav.classList.remove('show');
        }
    });

    // --- Логика грядок и посадки ---
    availableBeds.forEach(bed => {
        bed.addEventListener('click', () => {
            // Если на грядке уже что-то есть, ничего не делаем
            if (bed.innerHTML !== '') return;

            // Сохраняем грядку, на которую кликнули
            activeBed = bed;

            // Позиционируем меню по центру кликнутой грядки
            const rect = bed.getBoundingClientRect();
// Вычисляем центр грядки и вычитаем половину размера меню, чтобы отцентровать его
            seedMenu.style.left = `${rect.left + rect.width / 2 - 50 + window.scrollX}px`; // 50 - половина ширины #seed-menu
            seedMenu.style.top = `${rect.top + rect.height / 2 - 50 + window.scrollY}px`; // 50 - половина высоты #seed-menu

            seedMenu.classList.remove('hidden');
            
            // Плавное появление
            setTimeout(() => {
                seedMenu.style.opacity = '1';
                seedMenu.style.transform = 'scale(1)';
            }, 10);
        });
    });

    // --- Логика выбора семян ---
    seedMenu.querySelectorAll('.seed-option').forEach(option => {
        option.addEventListener('click', () => {
            if (!activeBed) return;

            const seedType = option.dataset.seed; // Получаем тип семени (например, '🥕')

            // Прячем меню
            hideSeedMenu();
            
            // Сажаем росток
            plantSeed(activeBed, seedType);
            
            // Сбрасываем активную грядку
            activeBed = null;
        });
    });

    // Функция посадки
    function plantSeed(bed, seed) {
        const plant = document.createElement('div');
        plant.classList.add('plant');
        plant.innerText = '🌱'; // Всегда начинаем с ростка
        bed.appendChild(plant);

        // Симулируем рост (5 секунд)
        setTimeout(() => {
            plant.innerText = seed; // Превращаем в выбранный овощ
            
            plant.addEventListener('click', (e) => {
                e.stopPropagation();
                bed.innerHTML = ''; // Очищаем грядку
                tg.HapticFeedback.notificationOccurred('success');
            }, { once: true });
        }, 5000);
    }
    
    // Функция для скрытия меню семян
    function hideSeedMenu() {
        seedMenu.style.opacity = '0';
        seedMenu.style.transform = 'scale(0.95)';
        setTimeout(() => {
            seedMenu.classList.add('hidden');
        }, 200); // Ждем завершения анимации
    }

    // Закрываем меню семян, если кликнуть в любом другом месте
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.garden-bed.available') && !event.target.closest('#seed-menu')) {
            if (!seedMenu.classList.contains('hidden')) {
                hideSeedMenu();
                activeBed = null;
            }
        }
    });
});
