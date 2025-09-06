document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- НАСТРОЙКИ ИГРЫ ---
    const CROP_DATA = {
        '🥕': { name: 'Морковь', growTime: 1000, seedCost: 1.00, sellPrice: 1.54 },
        '🍅': { name: 'Помидор', growTime: 3000, seedCost: 3.00, sellPrice: 4.62 },
        '🍆': { name: 'Баклажан', growTime: 5000, seedCost: 5.00, sellPrice: 7.70 },
        '🌽': { name: 'Кукуруза', growTime: 7000, seedCost: 7.00, sellPrice: 10.78 },
        '🍓': { name: 'Клубника', growTime: 10000, seedCost: 10.00, sellPrice: 15.40 }
    };
    
    // --- ДАННЫЕ ИГРОКА (дефолтные значения) ---
    let gameState = {
        balance: 100,
        warehouse: {}
    };

    // --- ЭЛЕМЕНТЫ DOM ---
    const balanceAmountElement = document.getElementById('balance-amount');
    const warehouseModal = document.getElementById('warehouse-modal');
    const warehouseList = document.getElementById('warehouse-list');
    const closeButton = warehouseModal.querySelector('.close-button');
    const sellAllButton = document.getElementById('sell-all-button');
    const warehouseButton = document.getElementById('warehouse-button');
    const menuButton = document.getElementById('menu-button');
    const menuNav = document.getElementById('menu-nav');
    const seedMenu = document.getElementById('seed-menu');
    const availableBeds = document.querySelectorAll('.garden-bed.available');
    let activeBed = null;

    // --- ФУНКЦИИ СОХРАНЕНИЯ И ЗАГРУЗКИ ---
    function saveGameData() {
        localStorage.setItem('farmGameState', JSON.stringify(gameState));
    }

    function loadGameData() {
        const savedData = localStorage.getItem('farmGameState');
        if (savedData) {
            gameState = JSON.parse(savedData);
        }
        updateBalanceDisplay();
        updateWarehouseDisplay();
    }

    // --- ФУНКЦИИ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА ---
    function updateBalanceDisplay() {
        balanceAmountElement.innerText = gameState.balance.toFixed(2);
    }

    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';
        const items = Object.keys(gameState.warehouse);
        if (items.length === 0) {
            warehouseList.innerHTML = '<li>Склад пуст</li>';
            return;
        }
        items.forEach(crop => {
            const li = document.createElement('li');
            li.innerText = `${crop} ${CROP_DATA[crop].name}: ${gameState.warehouse[crop]} шт.`;
            warehouseList.appendChild(li);
        });
    }

    // --- ЛОГИКА ГЛАВНОГО МЕНЮ ---
    menuButton.addEventListener('click', () => {
        menuNav.classList.toggle('show');
    });

    // --- ЛОГИКА ГРЯДОК И ПОСАДКИ ---
    availableBeds.forEach(bed => {
        bed.addEventListener('click', () => {
            if (bed.innerHTML !== '') return;
            activeBed = bed;
            const rect = bed.getBoundingClientRect();
            seedMenu.style.left = `${rect.left + rect.width / 2 - 50 + window.scrollX}px`;
            seedMenu.style.top = `${rect.top + rect.height / 2 - 50 + window.scrollY}px`;
            seedMenu.classList.remove('hidden');
        });
    });

    seedMenu.querySelectorAll('.seed-option').forEach(option => {
        option.addEventListener('click', () => {
            if (!activeBed) return;
            const seedType = option.dataset.seed;
            const crop = CROP_DATA[seedType];

            if (gameState.balance < crop.seedCost) {
                tg.showAlert('Недостаточно монет!');
                return;
            }

            gameState.balance -= crop.seedCost;
            updateBalanceDisplay();
            saveGameData();

            hideSeedMenu();
            plantSeed(activeBed, seedType);
            activeBed = null;
        });
    });

    function plantSeed(bed, seed) {
        const crop = CROP_DATA[seed];
        const plant = document.createElement('div');
        plant.classList.add('plant');
        plant.innerText = '🌱';
        bed.appendChild(plant);

        setTimeout(() => {
            plant.innerText = seed;
            plant.addEventListener('click', (e) => {
                e.stopPropagation();
                
                gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
                saveGameData();

                bed.innerHTML = '';
                tg.HapticFeedback.notificationOccurred('success');
                tg.showPopup({
                    title: 'Урожай собран!',
                    message: `1 ${crop.name} добавлен на склад.`,
                    buttons: [{type: 'ok'}]
                });
            }, { once: true });
        }, crop.growTime);
    }

    // --- ЛОГИКА СКЛАДА ---
    warehouseButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateWarehouseDisplay();
        warehouseModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        warehouseModal.classList.add('hidden');
    });
    
    warehouseModal.addEventListener('click', (event) => {
        if (event.target === warehouseModal) {
            warehouseModal.classList.add('hidden');
        }
    });

    sellAllButton.addEventListener('click', () => {
        let totalProfit = 0;
        Object.keys(gameState.warehouse).forEach(crop => {
            totalProfit += gameState.warehouse[crop] * CROP_DATA[crop].sellPrice;
        });

        if (totalProfit === 0) {
            tg.showAlert('Склад пуст, нечего продавать!');
            return;
        }

        gameState.balance += totalProfit;
        gameState.warehouse = {};
        saveGameData();

        updateBalanceDisplay();
        updateWarehouseDisplay();
        tg.showPopup({
            title: 'Урожай продан!',
            message: `Вы заработали ${totalProfit.toFixed(2)} монет.`,
            buttons: [{type: 'ok'}]
        });
    });

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function hideSeedMenu() {
        seedMenu.classList.add('hidden');
    }
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.garden-bed.available') && !event.target.closest('#seed-menu')) {
            hideSeedMenu();
        }
        if (!menuButton.contains(event.target) && !menuNav.contains(event.target)) {
            menuNav.classList.remove('show');
        }
    });

    // --- НАЧАЛЬНАЯ ЗАГРУЗКА ИГРЫ ---
    loadGameData();
});
