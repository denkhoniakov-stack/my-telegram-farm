document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Раскрываем приложение на весь экран

    // --- НАСТРОЙКИ ИГРЫ ---
    const PLANT_DATA = {
        '🥕': { name: 'Морковь', growTime: 1000, seedCost: 1.00, sellPrice: 1.54 },
        '🍅': { name: 'Помидор', growTime: 3000, seedCost: 3.00, sellPrice: 4.62 },
        '🍆': { name: 'Баклажан', growTime: 5000, seedCost: 5.00, sellPrice: 7.70 },
        '🌽': { name: 'Кукуруза', growTime: 7000, seedCost: 7.00, sellPrice: 10.78 },
        '🍓': { name: 'Клубника', growTime: 10000, seedCost: 10.00, sellPrice: 15.40 }
    };
    
    // --- ДАННЫЕ ИГРОКА ---
    let gameState = {
        balance: 100,
        warehouse: {},
        seedInventory: { '🥕': 3 }
    };

    // --- ЭЛЕМЕНТЫ DOM ---
    const balanceAmountElement = document.getElementById('balance-amount');
    const availableBeds = document.querySelectorAll('.garden-bed.available');
    const seedMenu = document.getElementById('seed-menu');
    let activeBed = null;

    // Модальные окна
    const warehouseModal = document.getElementById('warehouse-modal');
    const shopModal = document.getElementById('shop-modal');
    
    // Элементы Склада
    const warehouseList = document.getElementById('warehouse-list');
    const sellAllButton = document.getElementById('sell-all-button');

    // Элементы Магазина
    const shopList = document.getElementById('shop-list');

    // Кнопки навигации
    const navButtons = document.querySelectorAll('.nav-button');
    const navFarmBtn = document.getElementById('nav-farm');
    const navWarehouseBtn = document.getElementById('nav-warehouse');
    const navShopBtn = document.getElementById('nav-shop');

    // --- СОХРАНЕНИЕ И ЗАГРУЗКА ---
    function saveGameData() { localStorage.setItem('farmGameState_v2', JSON.stringify(gameState)); }
    function loadGameData() {
        const savedData = localStorage.getItem('farmGameState_v2');
        if (savedData) {
            gameState = JSON.parse(savedData);
            if (!gameState.seedInventory) gameState.seedInventory = {};
            if (!gameState.warehouse) gameState.warehouse = {};
        }
        updateBalanceDisplay();
    }

    // --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
    function updateBalanceDisplay() { balanceAmountElement.innerText = gameState.balance.toFixed(2); }
    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';
        const items = Object.keys(gameState.warehouse);
        if (items.length === 0) {
            warehouseList.innerHTML = '<li>Склад пуст</li>';
            sellAllButton.style.display = 'none';
            return;
        }
        sellAllButton.style.display = 'block';
        items.forEach(crop => {
            const li = document.createElement('li');
            li.innerText = `${crop} ${PLANT_DATA[crop].name}: ${gameState.warehouse[crop]} шт.`;
            warehouseList.appendChild(li);
        });
    }

    // --- ЛОГИКА ПОСАДКИ ---
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

            if (!gameState.seedInventory[seedType] || gameState.seedInventory[seedType] <= 0) {
                tg.showAlert('У вас нет таких семян. Купите их в магазине!');
                return;
            }

            gameState.seedInventory[seedType]--;
            saveGameData();

            hideSeedMenu();
            plantSeed(activeBed, seedType);
            activeBed = null;
        });
    });

    function plantSeed(bed, seed) {
        const plantInfo = PLANT_DATA[seed];
        const plantElement = document.createElement('div');
        plantElement.classList.add('plant');
        plantElement.innerText = '🌱';
        bed.appendChild(plantElement);

        setTimeout(() => {
            plantElement.innerText = seed;
            plantElement.addEventListener('click', (e) => {
                e.stopPropagation();
                gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
                saveGameData();
                bed.innerHTML = '';
                tg.HapticFeedback.notificationOccurred('success');
                tg.showPopup({ title: 'Урожай собран!', message: `1 ${plantInfo.name} добавлен на склад.` });
            }, { once: true });
        }, plantInfo.growTime);
    }
    
    function hideSeedMenu() { seedMenu.classList.add('hidden'); }
    document.addEventListener('click', (e) => { if (!e.target.closest('.garden-bed.available') && !e.target.closest('#seed-menu')) { hideSeedMenu(); } });

    // --- ЛОГИКА НИЖНЕЙ НАВИГАЦИИ ---
    function handleNavClick(clickedBtn) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        // Сначала скрываем все модальные окна
        warehouseModal.classList.add('hidden');
        shopModal.classList.add('hidden');

        // Открываем нужное окно
        switch (clickedBtn.id) {
            case 'nav-warehouse':
                updateWarehouseDisplay();
                warehouseModal.classList.remove('hidden');
                break;
            case 'nav-shop':
                populateShop();
                shopModal.classList.remove('hidden');
                break;
            case 'nav-farm':
                 // Просто скрываем все окна, чтобы показать ферму
                break;
             // Заглушки для будущих кнопок
            case 'nav-tasks':
            case 'nav-leaders':
            case 'nav-settings':
                tg.showAlert(`Раздел "${clickedBtn.querySelector('.nav-label').innerText}" в разработке!`);
                navFarmBtn.click(); // Возвращаемся на ферму
                break;
        }
    }
    
    navButtons.forEach(btn => btn.addEventListener('click', () => handleNavClick(btn)));

    // --- ЛОГИКА ПРОДАЖИ СО СКЛАДА ---
    sellAllButton.addEventListener('click', () => {
        let totalProfit = 0;
        Object.keys(gameState.warehouse).forEach(crop => { totalProfit += gameState.warehouse[crop] * PLANT_DATA[crop].sellPrice; });
        if (totalProfit === 0) { tg.showAlert('Склад пуст!'); return; }
        gameState.balance += totalProfit;
        gameState.warehouse = {};
        saveGameData();
        updateBalanceDisplay();
        updateWarehouseDisplay();
        tg.showPopup({ title: 'Урожай продан!', message: `Вы заработали ${totalProfit.toFixed(2)} монет.` });
    });

    // --- ЛОГИКА МАГАЗИНА ---
    function populateShop() {
        shopList.innerHTML = '';
        Object.keys(PLANT_DATA).forEach(seed => {
            const plant = PLANT_DATA[seed];
            const li = document.createElement('li');
            li.className = 'shop-item';
            li.innerHTML = `<span class="shop-item-name">${seed} ${plant.name}</span><button class="buy-button" data-seed="${seed}">${plant.seedCost.toFixed(2)} 🪙</button>`;
            shopList.appendChild(li);
        });
    }

    shopList.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-button')) {
            const seedType = e.target.dataset.seed;
            const plant = PLANT_DATA[seedType];
            if (gameState.balance < plant.seedCost) { tg.showAlert('Недостаточно монет!'); return; }
            gameState.balance -= plant.seedCost;
            gameState.seedInventory[seedType] = (gameState.seedInventory[seedType] || 0) + 1;
            saveGameData();
            updateBalanceDisplay();
            tg.HapticFeedback.notificationOccurred('success');
        }
    });

    // --- ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ---
    function setupModalClose(modal) {
        modal.querySelector('.close-button').addEventListener('click', () => {
             modal.classList.add('hidden');
             navFarmBtn.click(); // Возвращаемся на ферму
        });
    }
    setupModalClose(warehouseModal);
    setupModalClose(shopModal);

    // --- НАЧАЛЬНАЯ ЗАГРУЗКА ---
    loadGameData();
});
