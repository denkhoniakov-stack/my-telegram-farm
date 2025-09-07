document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

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
        warehouse: {}, // Готовый урожай
        seedInventory: { '🥕': 3 } // Семена на "складе семян"
    };

    // --- ЭЛЕМЕНТЫ DOM ---
    const balanceAmountElement = document.getElementById('balance-amount');
    const availableBeds = document.querySelectorAll('.garden-bed.available');
    const seedMenu = document.getElementById('seed-menu');
    let activeBed = null;
    const warehouseModal = document.getElementById('warehouse-modal');
    const shopModal = document.getElementById('shop-modal');
    const warehouseList = document.getElementById('warehouse-list');
    const sellAllButton = document.getElementById('sell-all-button');
    const shopList = document.getElementById('shop-list');
    const navButtons = document.querySelectorAll('.nav-button');
    const navFarmBtn = document.getElementById('nav-farm');

    // --- СОХРАНЕНИЕ И ЗАГРУЗКА ---
    function saveGameData() { localStorage.setItem('farmGameState_v4', JSON.stringify(gameState)); }
    function loadGameData() {
        const savedData = localStorage.getItem('farmGameState_v4');
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
        const items = Object.keys(gameState.warehouse).filter(key => gameState.warehouse[key] > 0);
        if (items.length === 0) {
            warehouseList.innerHTML = '<li>Склад урожая пуст</li>';
            sellAllButton.style.display = 'none';
            return;
        }
        sellAllButton.style.display = 'block';
        items.forEach(crop => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${crop} ${PLANT_DATA[crop].name}:</span> <span>${gameState.warehouse[crop]} шт.</span>`;
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            warehouseList.appendChild(li);
        });
    }

    // --- ЛОГИКА ПОСАДКИ (ПОЛНОСТЬЮ ПЕРЕРАБОТАНА) ---
    availableBeds.forEach(bed => {
        bed.addEventListener('click', () => {
            if (bed.innerHTML !== '') return;
            activeBed = bed;
            showPlantingMenu(bed); // Вызываем новую функцию
        });
    });

    // НОВАЯ ФУНКЦИЯ ДЛЯ ДИНАМИЧЕСКОГО МЕНЮ ПОСАДКИ
    function showPlantingMenu(bed) {
        const availableSeeds = Object.keys(gameState.seedInventory).filter(seed => gameState.seedInventory[seed] > 0);
        
        if (availableSeeds.length === 0) {
            tg.showAlert('У вас нет семян для посадки. Зайдите в магазин!');
            return;
        }

        seedMenu.innerHTML = ''; // Очищаем старые иконки
        
        const radius = 70; // Радиус круга
        const angleStep = 120 / (availableSeeds.length + 1); // Распределяем по полукругу

        availableSeeds.forEach((seed, index) => {
            const angle = -30 + (angleStep * (index + 1));
            const angleRad = angle * (Math.PI / 180); // Конвертируем в радианы
            
            const option = document.createElement('div');
            option.className = 'seed-option';
            option.dataset.seed = seed;
            option.innerText = seed;
            option.style.transform = `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`;
            
            option.addEventListener('click', () => {
                handleSeedSelection(seed);
            });

            seedMenu.appendChild(option);
        });

        const rect = bed.getBoundingClientRect();
        seedMenu.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
        seedMenu.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
        seedMenu.classList.remove('hidden');
    }

    function handleSeedSelection(seedType) {
        if (!activeBed) return;

        gameState.seedInventory[seedType]--;
        saveGameData();

        hideSeedMenu();
        plantSeed(activeBed, seedType);
        activeBed = null;
    }

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
    navButtons.forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        switch (btn.id) {
            case 'nav-warehouse':
                updateWarehouseDisplay();
                warehouseModal.classList.remove('hidden');
                break;
            case 'nav-shop':
                populateShop();
                shopModal.classList.remove('hidden');
                break;
            case 'nav-farm': break;
            case 'nav-tasks': case 'nav-leaders': case 'nav-settings':
                tg.showAlert(`Раздел в разработке!`);
                navFarmBtn.click();
                break;
        }
    }));

    // --- ЛОГИКА ПРОДАЖИ СО СКЛАДА ---
    sellAllButton.addEventListener('click', () => {
        let totalProfit = 0;
        Object.keys(gameState.warehouse).forEach(crop => { totalProfit += gameState.warehouse[crop] * PLANT_DATA[crop].sellPrice; });
        if (totalProfit === 0) { return; }
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
            const currentSeeds = gameState.seedInventory[seed] || 0;
            const li = document.createElement('li');
            li.className = 'shop-item';
            li.innerHTML = `
                <div class="shop-item-icon">${seed}</div>
                <div class="shop-item-details">
                    <div class="shop-item-title">Семена ${plant.name.toLowerCase()}</div>

                    <div class="shop-item-info">
                        <span>Время роста: ${plant.growTime / 1000}с</span> |
                        <span>Продажа: ${plant.sellPrice.toFixed(2)} 🪙</span>
                    </div>
                </div>
                <div class="shop-item-buy">
                    <button class="buy-button" data-seed="${seed}">${plant.seedCost.toFixed(2)} 🪙</button>
                    <div class="seed-inventory-count" id="inv-count-${seed}">В наличии: ${currentSeeds}</div>

                </div>
            `;
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
            document.getElementById(`inv-count-${seedType}`).innerText = `На складе: ${gameState.seedInventory[seedType]}`;
            tg.HapticFeedback.notificationOccurred('success');
        }
    });

    // --- ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ---
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });

    // --- НАЧАЛЬНАЯ ЗАГРУЗКА ---
    loadGameData();
});
