// НАЧНИТЕ КОПИРОВАТЬ ОТСЮДА

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
        seedInventory: { '🥕': 3, '🍅': 1, '🍆': 1, '🌽': 1, '🍓': 1 }, // Добавил семян для тестов
        items: {}
    };

    // --- ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СТРАНИЦЫ ---
    const balanceAmountElement = document.getElementById('balance-amount');
    const gardenContainer = document.getElementById('garden-container');
    const seedMenu = document.getElementById('seed-menu');
    const warehouseModal = document.getElementById('warehouse-modal');
    const shopModal = document.getElementById('shop-modal');
    const warehouseList = document.getElementById('warehouse-list');
    const sellAllButton = document.getElementById('sell-all-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const navFarmBtn = document.getElementById('nav-farm');
    const shopTabsContainer = document.querySelector('.shop-tabs');
    const tabContents = document.querySelectorAll('.shop-tab-content');
    let activeBed = null;

    // --- ОСНОВНЫЕ ФУНКЦИИ ИГРЫ ---
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
    function updateBalanceDisplay() { balanceAmountElement.innerText = gameState.balance.toFixed(2); }
    
    // --- ФИНАЛЬНАЯ ВЕРСИЯ ФУНКЦИИ ВЫБОРА СЕМЯН ---
    function showPlantingMenu(bed) {
        const availableSeeds = Object.keys(gameState.seedInventory).filter(seed => gameState.seedInventory[seed] > 0);
        if (availableSeeds.length === 0) {
            tg.showAlert('У вас нет семян для посадки. Зайдите в магазин!');
            return;
        }

        seedMenu.innerHTML = '';
        
        const numItems = availableSeeds.length;
        const itemVisualWidth = 65; 
        const screenEdgePadding = 25; 

        // Шаг 1: Расчет динамического радиуса
        const rect = bed.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const iconRadius = itemVisualWidth / 2;
        const maxRadiusByPosition = Math.min(centerX, window.innerWidth - centerX) - iconRadius - screenEdgePadding;
        const idealCircumference = numItems * itemVisualWidth;
        let idealRadius = idealCircumference / (2 * Math.PI);
        if (numItems <= 2) { idealRadius = 50; }
        const finalRadius = Math.max(55, Math.min(maxRadiusByPosition, idealRadius));

        // Шаг 2: Расчет углов с "умным поворотом"
        const angleStep = (2 * Math.PI) / numItems;
        // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Сразу поворачиваем круг на половину шага,
        // чтобы "опасные" горизонтальные точки были пустыми.
        const angleOffset = angleStep / 2;

        // Шаг 3: Генерация иконок
        availableSeeds.forEach((seed, index) => {
            const angle = angleOffset + index * angleStep;
            const x = finalRadius * Math.cos(angle);
            const y = finalRadius * Math.sin(angle);

            const option = document.createElement('div');
            option.className = 'seed-option';
            option.style.transform = `translate(${x}px, ${y}px)`;
            
            const count = gameState.seedInventory[seed];
            option.innerHTML = `
                <div class="seed-option-inner">
                    <span class="seed-emoji">${seed}</span>
                    <span class="seed-count">${count}</span>
                </div>
            `;
            
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                handleSeedSelection(seed);
            });
            seedMenu.appendChild(option);
        });

        // Центральная кнопка
        const closeButton = document.createElement('div');
        closeButton.className = 'seed-menu-close-button';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            hideSeedMenu();
        });
        seedMenu.appendChild(closeButton);

        // Позиционирование меню
        seedMenu.style.left = `${centerX}px`;
        seedMenu.style.top = `${rect.top + rect.height / 2}px`;
        seedMenu.classList.remove('hidden');
    }

    // --- ОСТАЛЬНОЙ КОД (остается без изменений) ---
    
    function hideSeedMenu() { seedMenu.classList.add('hidden'); }
    
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
    
    function plantSeed(bed, seed) {
        const plantInfo = PLANT_DATA[seed];
        const growTimeInSeconds = plantInfo.growTime / 1000;
        let remainingTime = growTimeInSeconds;

        bed.innerHTML = '';
        const plantElement = document.createElement('div');
        plantElement.classList.add('plant');
        plantElement.innerText = '🌱';

        const timerElement = document.createElement('div');
        timerElement.classList.add('plant-timer');

        bed.appendChild(plantElement);
        bed.appendChild(timerElement);

        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        }
        timerElement.innerText = formatTime(remainingTime);

        const timerInterval = setInterval(() => {
            remainingTime--;
            timerElement.innerText = formatTime(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                bed.removeChild(timerElement);
                plantElement.innerText = seed;
                plantElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    animateHarvest(plantElement, seed);
                    gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
                    saveGameData();
                    bed.innerHTML = '';
                    tg.HapticFeedback.notificationOccurred('success');
                }, { once: true });
            }
        }, 1000);
    }
    
    function animateHarvest(startElement, seed) {
        const endElement = document.getElementById('nav-warehouse');
        if (!endElement) return;
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

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.garden-bed') && !e.target.closest('#seed-menu')) {
            hideSeedMenu();
        }
    });
    
    // --- ВСЯ ЛОГИКА МАГАЗИНА И НАВИГАЦИИ ---
    
    // Единый обработчик навигации
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
                if (shopTabsContainer) {
                    shopTabsContainer.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
                }
                tabContents.forEach(content => content.classList.remove('active'));
                const seedsTabButton = shopTabsContainer.querySelector('.tab-button[data-tab="seeds"]');
                if (seedsTabButton) seedsTabButton.classList.add('active');
                const seedsTabContent = document.getElementById('seeds-tab');
                if (seedsTabContent) seedsTabContent.classList.add('active');
                populateShopSeeds();
                populateShopTabs();
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
    
    // Переключение вкладок в магазине
    if (shopTabsContainer) {
        shopTabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                shopTabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                e.target.classList.add('active');
                const tabId = e.target.dataset.tab;
                document.getElementById(`${tabId}-tab`).classList.add('active');
            }
        });
    }

    // Универсальный обработчик покупок
    shopModal.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-button') || e.target.disabled) return;
        const button = e.target;
        const itemType = button.dataset.itemType, itemId = button.dataset.itemId, seedId = button.dataset.seed;
        let price = 0, itemData = null;
        if (seedId) { itemData = PLANT_DATA[seedId]; price = itemData.seedCost; } 
        else if (itemId && itemType) {
            switch (itemType) {
                case 'inventory': itemData = INVENTORY_DATA[itemId]; break;
                case 'booster':   itemData = BOOSTERS_DATA[itemId]; break;
                case 'decor':     itemData = DECOR_DATA[itemId]; break;
            }
            if (itemData) price = itemData.price;
        }
        if (!itemData || gameState.balance < price) { if (itemData) tg.showAlert('Недостаточно монет!'); return; }
        if ((itemType === 'inventory' || itemType === 'decor') && gameState.items[itemId]) { tg.showAlert('Этот предмет у вас уже есть!'); return; }
        gameState.balance -= price;
        if (seedId) {
            gameState.seedInventory[seedId] = (gameState.seedInventory[seedId] || 0) + 1;
            document.getElementById(`inv-count-${seedId}`).innerText = `В наличии: ${gameState.seedInventory[seedId]}`;
        } else if (itemId) {
            gameState.items[itemId] = true;
            button.disabled = true; button.innerText = 'Куплено';
        }
        updateBalanceDisplay(); saveGameData(); tg.HapticFeedback.notificationOccurred('success');
    });

    // Функции заполнения магазина
    function populateShopSeeds() {
        const shopListContainer = document.querySelector('#seeds-tab ul');
        if (!shopListContainer) return;
        shopListContainer.innerHTML = '';
        Object.keys(PLANT_DATA).forEach(seed => {
            const plant = PLANT_DATA[seed];
            const currentSeeds = gameState.seedInventory[seed] || 0;
            const li = document.createElement('li');
            li.className = 'shop-item';
            li.innerHTML = `<div class="shop-item-icon">${seed}</div><div class="shop-item-details"><div class="shop-item-title">Семена ${plant.name.toLowerCase()}</div><div class="shop-item-info"><span>Рост: ${plant.growTime / 1000}с</span> | <span>Продажа: ${plant.sellPrice.toFixed(2)} 🪙</span></div></div><div class="shop-item-buy"><button class="buy-button" data-seed="${seed}">${plant.seedCost.toFixed(2)} 🪙</button><div class="seed-inventory-count" id="inv-count-${seed}">В наличии: ${currentSeeds}</div></div>`;
            shopListContainer.appendChild(li);
        });
    }
    function populateShopTabs() {
        const lists = { inventory: { container: document.querySelector('#inventory-tab'), data: INVENTORY_DATA, icon: '🛠️' }, boosters: { container: document.querySelector('#boosters-tab'), data: BOOSTERS_DATA, icon: '⚡️' }, decor: { container: document.querySelector('#decor-tab'), data: DECOR_DATA, icon: '🎨' } };
        for (const type in lists) {
            const { container, data, icon } = lists[type];
            if (!container) continue;
            container.innerHTML = '';
            const ul = document.createElement('ul'); ul.style.padding = '0';
            for (const key in data) {
                const item = data[key]; const li = document.createElement('li'); li.className = 'shop-item';
                const isItemOwned = gameState.items[key];
                const buttonHTML = isItemOwned ? `<button class="buy-button" disabled>Куплено</button>` : `<button class="buy-button" data-item-id="${key}" data-item-type="${type}">${item.price} 🪙</button>`;
                li.innerHTML = `<div class="shop-item-icon">${icon}</div><div class="shop-item-details"><div class="shop-item-title">${item.name}</div><div class="shop-item-info">${item.bonus}</div></div><div class="shop-item-buy">${buttonHTML}</div>`;
                ul.appendChild(li);
            }
            container.appendChild(ul);
        }
    }
    
    // Обработчик продажи и закрытия модалок
    sellAllButton.addEventListener('click', () => {
        let totalProfit = 0;
        Object.keys(gameState.warehouse).forEach(crop => { totalProfit += gameState.warehouse[crop] * PLANT_DATA[crop].sellPrice; });
        if (totalProfit === 0) return;
        gameState.balance += totalProfit; gameState.warehouse = {};
        saveGameData(); updateBalanceDisplay(); updateWarehouseDisplay();
        tg.showPopup({ title: 'Урожай продан!', message: `Вы заработали ${totalProfit.toFixed(2)} монет.` });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });
    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';
        const items = Object.keys(gameState.warehouse).filter(key => gameState.warehouse[key] > 0);
        if (items.length === 0) { warehouseList.innerHTML = '<li>Склад урожая пуст</li>'; sellAllButton.style.display = 'none'; return; }
        sellAllButton.style.display = 'block';
        items.forEach(crop => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${crop} ${PLANT_DATA[crop].name}:</span> <span>${gameState.warehouse[crop]} шт.</span>`;
            li.style.display = 'flex'; li.style.justifyContent = 'space-between';
            warehouseList.appendChild(li);
        });
    }

    // --- ЗАПУСК ИГРЫ ---
    loadGameData();

}); // <-- КОНЕЦ КОДА

// ЗАКОНЧИТЕ КОПИРОВАТЬ ЗДЕСЬ
