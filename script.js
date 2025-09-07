document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // --- БАЗА ДАННЫХ ПРЕДМЕТОВ ---
    const INVENTORY_DATA = {
        'super-rake': { name: 'Супер-Лейка', price: 150, bonus: 'Увеличивает урожай на 5% (пассивно)' },
        'golden-spade': { name: 'Золотая Лопата', price: 250, bonus: 'Ускоряет посадку на 15% (пассивно)' },
        'smart-scarecrow': { name: 'Умное Пугало', price: 200, bonus: 'Снижает шанс неудачного урожая на 10% (пассивно)' },
        'turbo-fertilizer': { name: 'Удобрение "Турбо-Рост"', price: 50, bonus: 'Ускоряет рост 1 растения на 25% (разовое использование)' },
        'farmer-gloves': { name: 'Фермерские Перчатки', price: 300, bonus: 'Шанс 2% на двойной урожай (пассивно)' }
    };

    const BOOSTERS_DATA = {
        'sun-rain': { name: 'Солнечный Дождь', price: 100, bonus: 'Мгновенно ускоряет все растения на 30%' },
        'fertility-elixir': { name: 'Эликсир Плодородия', price: 75, bonus: 'Ускоряет рост всех семян на 50% в течение 10 минут' },
        'golden-hour': { name: 'Золотой Час', price: 120, bonus: 'Увеличивает цену продажи всего урожая на 20% в течение 1 часа' }
    };

    const DECOR_DATA = {
        'weather-vane': { name: 'Веселый Флюгер', price: 500, bonus: 'Шанс найти редкие семена +1% (пассивно)' },
        'beehive': { name: 'Пчелиный Улей', price: 750, bonus: 'Увеличивает весь урожай на 2% (пассивно)' }
    };


    const PLANT_DATA = {
        '🥕': { name: 'Морковь', growTime: 1000, seedCost: 1.00, sellPrice: 1.54 },
        '🍅': { name: 'Помидор', growTime: 3000, seedCost: 3.00, sellPrice: 4.62 },
        '🍆': { name: 'Баклажан', growTime: 5000, seedCost: 5.00, sellPrice: 7.70 },
        '🌽': { name: 'Кукуруза', growTime: 7000, seedCost: 7.00, sellPrice: 10.78 },
        '🍓': { name: 'Клубника', growTime: 10000, seedCost: 10.00, sellPrice: 15.40 }
    };
    
    let gameState = {
        balance: 100,
        warehouse: {},
        seedInventory: { '🥕': 3 },
        items: {
        }    
    };

    const balanceAmountElement = document.getElementById('balance-amount');
    const gardenContainer = document.getElementById('garden-container');
    const seedMenu = document.getElementById('seed-menu');
    let activeBed = null;
    const warehouseModal = document.getElementById('warehouse-modal');
    const shopModal = document.getElementById('shop-modal');
    const warehouseList = document.getElementById('warehouse-list');
    const sellAllButton = document.getElementById('sell-all-button');
    const shopList = document.getElementById('shop-list');
    const navButtons = document.querySelectorAll('.nav-button');
    const navFarmBtn = document.getElementById('nav-farm');
    const navWarehouseBtn = document.getElementById('nav-warehouse');
    const navShopBtn = document.getElementById('nav-shop');

    function saveGameData() { localStorage.setItem('farmGameState_v4', JSON.stringify(gameState)); }
    function loadGameData() {
        const savedData = localStorage.getItem('farmGameState_v4');
        if (savedData) {
            gameState = JSON.parse(savedData);
            if (!gameState.seedInventory) gameState.seedInventory = {};
            if (!gameState.warehouse) gameState.warehouse = {};
            if (!gameState.items) gameState.items = {};
        }
        updateBalanceDisplay();
    }

    navWarehouseBtn.addEventListener('click', () => {
    // Логика открытия склада
        warehouseModal.classList.remove('hidden');
        updateWarehouseDisplay();
    });

// --- ДОБАВЬТЕ ЭТОТ ОБРАБОТЧИК ДЛЯ КНОПКИ МАГАЗИНА ---
    navShopBtn.addEventListener('click', () => {
        shopModal.classList.remove('hidden');
    // Здесь можно добавить функцию, которая будет отображать первую вкладку магазина по умолчанию
    // например, showShopTab('seeds'); 
    });

// Не забудьте про кнопку закрытия модального окна
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
        // Прячем все модальные окна
            warehouseModal.classList.add('hidden');
            shopModal.classList.add('hidden');
        });
    });

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
                animateHarvest(plantElement, seed);
                gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
                saveGameData();
                bed.innerHTML = '';
                tg.HapticFeedback.notificationOccurred('success');
            }, { once: true });
        }, plantInfo.growTime);
    }
    
    function animateHarvest(startElement, seed) {
        const endElement = navWarehouseBtn;
        const flyingCrop = document.createElement('div');
        flyingCrop.innerText = seed;
        flyingCrop.className = 'flying-crop';
        document.body.appendChild(flyingCrop);
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();
        flyingCrop.style.left = `${startRect.left + startRect.width / 2 - 18}px`;
        flyingCrop.style.top = `${startRect.top + startRect.height / 2 - 18}px`;
        const deltaX = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
        const deltaY = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);
        flyingCrop.style.setProperty('--target-x', `${deltaX}px`);
        flyingCrop.style.setProperty('--target-y', `${deltaY}px`);
        flyingCrop.addEventListener('animationend', () => flyingCrop.remove());
    }

    gardenContainer.addEventListener('click', (event) => {
        const bed = event.target.closest('.garden-bed.available');
        if (bed && bed.innerHTML === '') {
            activeBed = bed;
            showPlantingMenu(bed);
        }
    });
    
    function showPlantingMenu(bed) {
        const availableSeeds = Object.keys(gameState.seedInventory).filter(seed => gameState.seedInventory[seed] > 0);
        if (availableSeeds.length === 0) {
            tg.showAlert('У вас нет семян для посадки. Зайдите в магазин!');
            return;
        }
        seedMenu.innerHTML = '';
        const radius = 80;
        const angleStep = availableSeeds.length > 1 ? 120 / (availableSeeds.length - 1) : 0;
        availableSeeds.forEach((seed, index) => {
            const angle = -60 + (angleStep * index);
            const option = document.createElement('div');
            option.className = 'seed-option';
            option.dataset.seed = seed;
            option.innerText = seed;
            option.style.transform = `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`;
            option.addEventListener('click', (e) => {
                e.stopPropagation();
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
        if ((gameState.seedInventory[seedType] || 0) > 0) {
            gameState.seedInventory[seedType]--;
            saveGameData();
            hideSeedMenu();
            plantSeed(activeBed, seedType);
            activeBed = null;
        } else {
            tg.showAlert(`У вас закончились семена ${PLANT_DATA[seedType].name}!`);
        }
    }

    function hideSeedMenu() {
        seedMenu.classList.add('hidden');
    }
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#garden-container') && !e.target.closest('#seed-menu')) {
            hideSeedMenu();
        }
    });

    navButtons.forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hideSeedMenu();
        switch (btn.id) {
            case 'nav-warehouse': 
                updateWarehouseDisplay(); 
                warehouseModal.classList.remove('hidden'); 
                break;
            case 'nav-shop': 
                populateShop();      // Эта функция, как и раньше, заполняет семена
                populateShopTabs();  // <-- ВОТ ЭТА НОВАЯ СТРОКА, она заполняет все остальные вкладки
                shopModal.classList.remove('hidden'); 
                break;
            case 'nav-tasks': 
            case 'nav-leaders': 
            case 'nav-settings':
                tg.showAlert(`Раздел в разработке!`);
                navFarmBtn.click();
                break;
        }
    }));
    
    sellAllButton.addEventListener('click', () => {
        let totalProfit = 0;
        Object.keys(gameState.warehouse).forEach(crop => {
            totalProfit += gameState.warehouse[crop] * PLANT_DATA[crop].sellPrice;
        });
        if (totalProfit === 0) return;
        gameState.balance += totalProfit;
        gameState.warehouse = {};
        saveGameData();
        updateBalanceDisplay();
        updateWarehouseDisplay();
        tg.showPopup({ title: 'Урожай продан!', message: `Вы заработали ${totalProfit.toFixed(2)} монет.` });
    });
    
    function populateShop() {
        shopList.innerHTML = '';
        Object.keys(PLANT_DATA).forEach(seed => {
            const plant = PLANT_DATA[seed];
            const currentSeeds = gameState.seedInventory[seed] || 0;
            const li = document.createElement('li');
            li.className = 'shop-item';
            li.innerHTML = `<div class="shop-item-icon">${seed}</div><div class="shop-item-details"><div class="shop-item-title">Семена ${plant.name.toLowerCase()}</div><div class="shop-item-info"><span>Время роста: ${plant.growTime / 1000}с</span> | <span>Продажа: ${plant.sellPrice.toFixed(2)} 🪙</span></div></div><div class="shop-item-buy"><button class="buy-button" data-seed="${seed}">${plant.seedCost.toFixed(2)} 🪙</button><div class="seed-inventory-count" id="inv-count-${seed}">В наличии: ${currentSeeds}</div></div>`;
            shopList.appendChild(li);
        });
    }
    
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });

    loadGameData();
});
// --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК В МАГАЗИНЕ ---
const shopTabsContainer = document.querySelector('.shop-tabs');
const tabContents = document.querySelectorAll('.shop-tab-content');

if (shopTabsContainer) {
    shopTabsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-button')) {
            // Убираем активность со всех кнопок и контента
            shopTabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавляем активность нажатой кнопке
            e.target.classList.add('active');
            
            // Находим и показываем нужный контент
            const tabId = e.target.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
        }
    });
}
function getHarvestBonus() {
    let bonus = 1.0; // 1.0 - это 100% (без бонуса)
    if (gameState.items['super-rake']) bonus += 0.05; // +5% от лейки
    if (gameState.items['beehive']) bonus += 0.02;    // +2% от улья
    return bonus;
}
function getGrowTime(baseTime) {
    let finalTime = baseTime;
    if (gameState.items['golden-spade']) finalTime *= 0.85; // -15% времени
    // Здесь можно будет добавить логику для временных ускорителей
    return finalTime;
}
function populateShopTabs() {
    const inventoryList = document.querySelector('#inventory-tab');
    const boostersList = document.querySelector('#boosters-tab');
    const decorList = document.querySelector('#decor-tab');

    // Очищаем списки перед заполнением
    inventoryList.innerHTML = '';
    boostersList.innerHTML = '';
    decorList.innerHTML = '';

    // --- 1. ЗАПОЛНЯЕМ ВКЛАДКУ "ИНВЕНТАРЬ" ---
    for (const key in INVENTORY_DATA) {
        const item = INVENTORY_DATA[key];
        const li = document.createElement('li');
        li.className = 'shop-item';
        li.innerHTML = `
            <div class="shop-item-icon">🛠️</div>
            <div class="shop-item-details">
                <div class="shop-item-title">${item.name}</div>
                <div class="shop-item-info">${item.bonus}</div>
            </div>
            <div class="shop-item-buy">
                <button class="buy-button" data-item-id="${key}" data-item-type="inventory">${item.price} 🪙</button>
            </div>`;
        inventoryList.appendChild(li);
    }

    // --- 2. ЗАПОЛНЯЕМ ВКЛАДКУ "УСКОРИТЕЛИ" ---
    for (const key in BOOSTERS_DATA) {
        const item = BOOSTERS_DATA[key];
        const li = document.createElement('li');
        li.className = 'shop-item';
        li.innerHTML = `
            <div class="shop-item-icon">⚡️</div>
            <div class="shop-item-details">
                <div class="shop-item-title">${item.name}</div>
                <div class="shop-item-info">${item.bonus}</div>
            </div>
            <div class="shop-item-buy">
                <button class="buy-button" data-item-id="${key}" data-item-type="booster">${item.price} 🪙</button>
            </div>`;
        boostersList.appendChild(li);
    }

    // --- 3. ЗАПОЛНЯЕМ ВКЛАДКУ "ДЕКОР" ---
    for (const key in DECOR_DATA) {
        const item = DECOR_DATA[key];
        const li = document.createElement('li');
        li.className = 'shop-item';
        li.innerHTML = `
            <div class="shop-item-icon">🎨</div>
            <div class="shop-item-details">
                <div class="shop-item-title">${item.name}</div>
                <div class="shop-item-info">${item.bonus}</div>
            </div>
            <div class="shop-item-buy">
                <button class="buy-button" data-item-id="${key}" data-item-type="decor">${item.price} 🪙</button>
            </div>`;
        decorList.appendChild(li);
    }
}


// --- ВСТАВЬТЕ ЭТОТ НОВЫЙ БЛОК КОДА ---

// Универсальный обработчик покупок в магазине
shopModal.addEventListener('click', (e) => {
    // Проверяем, что клик был именно по кнопке "купить"
    if (!e.target.classList.contains('buy-button')) {
        return;
    }

    const button = e.target;
    const itemType = button.dataset.itemType; // 'inventory', 'booster', 'decor' или undefined для семян
    const itemId = button.dataset.itemId;     // ID предмета (например, 'super-rake')
    const seedId = button.dataset.seed;       // ID семян (например, '🥕')

    let price = 0;
    let itemData = null;

    // --- Определяем, что покупается ---
    if (seedId) {
        // Покупка семян
        itemData = PLANT_DATA[seedId];
        price = itemData.seedCost;
    } else if (itemId && itemType) {
        // Покупка инвентаря, ускорителя или декора
        switch (itemType) {
            case 'inventory': itemData = INVENTORY_DATA[itemId]; break;
            case 'booster':   itemData = BOOSTERS_DATA[itemId]; break;
            case 'decor':     itemData = DECOR_DATA[itemId]; break;
        }
        if (itemData) {
            price = itemData.price;
        }
    }

    if (!itemData) return; // Если товар не найден, ничего не делаем

    // --- Проверяем баланс и наличие предмета ---
    if (gameState.balance < price) {
        tg.showAlert('Недостаточно монет!');
        return;
    }
    // Проверяем, есть ли уже такой предмет (для пассивных улучшений)
    if (itemType === 'inventory' || itemType === 'decor') {
        if (gameState.items[itemId]) {
            tg.showAlert('Этот предмет у вас уже есть!');
            return;
        }
    }

    // --- Проводим покупку ---
    gameState.balance -= price;

    if (seedId) {
        // Добавляем семена
        gameState.seedInventory[seedId] = (gameState.seedInventory[seedId] || 0) + 1;
        // Обновляем счетчик семян в магазине
        document.getElementById(`inv-count-${seedId}`).innerText = `В наличии: ${gameState.seedInventory[seedId]}`;
    } else if (itemId) {
        // Добавляем предмет в инвентарь игрока
        gameState.items[itemId] = true; // Отмечаем, что предмет куплен
        // Делаем кнопку неактивной, чтобы нельзя было купить снова
        button.disabled = true;
        button.innerText = 'Куплено';
    }

    // --- Обновляем состояние игры и интерфейс ---
    updateBalanceDisplay();
    saveGameData();
    tg.HapticFeedback.notificationOccurred('success');
});
