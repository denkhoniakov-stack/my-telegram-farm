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
        seedInventory: { '🥕': 3 },
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
    const shopList = document.getElementById('shop-list');
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
    
    // --- ВСЕ ФУНКЦИИ МАГАЗИНА ---

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
        const lists = {
            inventory: { container: document.querySelector('#inventory-tab'), data: INVENTORY_DATA, icon: '🛠️' },
            boosters: { container: document.querySelector('#boosters-tab'), data: BOOSTERS_DATA, icon: '⚡️' },
            decor: { container: document.querySelector('#decor-tab'), data: DECOR_DATA, icon: '🎨' }
        };

        for (const type in lists) {
            const { container, data, icon } = lists[type];
            if (!container) continue;

            container.innerHTML = ''; // Очистка
            const ul = document.createElement('ul');
            ul.style.padding = '0'; // Убираем отступы у списка
            
            for (const key in data) {
                const item = data[key];
                const li = document.createElement('li');
                li.className = 'shop-item';
                
                // Проверяем, куплен ли предмет, и делаем кнопку неактивной
                const isItemOwned = gameState.items[key];
                const buttonHTML = isItemOwned
                    ? `<button class="buy-button" disabled>Куплено</button>`
                    : `<button class="buy-button" data-item-id="${key}" data-item-type="${type}">${item.price} 🪙</button>`;

                li.innerHTML = `
                    <div class="shop-item-icon">${icon}</div>
                    <div class="shop-item-details">
                        <div class="shop-item-title">${item.name}</div>
                        <div class="shop-item-info">${item.bonus}</div>
                    </div>
                    <div class="shop-item-buy">${buttonHTML}</div>`;
                ul.appendChild(li);
            }
            container.appendChild(ul);
        }
    }
    
    // --- ЕДИНЫЙ ОБРАБОТЧИК НАВИГАЦИИ ---
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
    // Убираем класс 'active' со всего содержимого вкладок
                tabContents.forEach(content => content.classList.remove('active'));

    // 2. Теперь принудительно делаем вкладку "Семена" активной
                const seedsTabButton = shopTabsContainer.querySelector('.tab-button[data-tab="seeds"]');
                if (seedsTabButton) {
                       seedsTabButton.classList.add('active');
                }
                const seedsTabContent = document.getElementById('seeds-tab');
                if (seedsTabContent) {
                        seedsTabContent.classList.add('active');
                }
                populateShopSeeds();  // Заполняем семена
                populateShopTabs();   // Заполняем остальные вкладки
                shopModal.classList.remove('hidden'); 
                
                // Устанавливаем первую вкладку (семена) активной по умолчанию
                shopTabsContainer.querySelector('.tab-button[data-tab="seeds"]').classList.add('active');
                document.getElementById('seeds-tab').classList.add('active');
                break;
            case 'nav-tasks': 
            case 'nav-leaders': 
            case 'nav-settings':
                tg.showAlert(`Раздел в разработке!`);
                navFarmBtn.click(); // Возвращаемся на ферму
                break;
        }
    }));
    
    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК В МАГАЗИНЕ ---
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

    // --- УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ПОКУПОК ---
    shopModal.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-button') || e.target.disabled) {
            return;
        }

        const button = e.target;
        const itemType = button.dataset.itemType;
        const itemId = button.dataset.itemId;
        const seedId = button.dataset.seed;

        let price = 0;
        let itemData = null;

        if (seedId) {
            itemData = PLANT_DATA[seedId];
            price = itemData.seedCost;
        } else if (itemId && itemType) {
            switch (itemType) {
                case 'inventory': itemData = INVENTORY_DATA[itemId]; break;
                case 'booster':   itemData = BOOSTERS_DATA[itemId]; break;
                case 'decor':     itemData = DECOR_DATA[itemId]; break;
            }
            if (itemData) price = itemData.price;
        }

        if (!itemData || gameState.balance < price) {
            if (!itemData) return;
            tg.showAlert('Недостаточно монет!');
            return;
        }
        
        if ((itemType === 'inventory' || itemType === 'decor') && gameState.items[itemId]) {
            tg.showAlert('Этот предмет у вас уже есть!');
            return;
        }

        gameState.balance -= price;

        if (seedId) {
            gameState.seedInventory[seedId] = (gameState.seedInventory[seedId] || 0) + 1;
            document.getElementById(`inv-count-${seedId}`).innerText = `В наличии: ${gameState.seedInventory[seedId]}`;
        } else if (itemId) {
            gameState.items[itemId] = true;
            button.disabled = true;
            button.innerText = 'Куплено';
        }

        updateBalanceDisplay();
        saveGameData();
        tg.HapticFeedback.notificationOccurred('success');
    });

    // --- ОСТАЛЬНАЯ ЛОГИКА ИГРЫ ---
    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';
        const items = Object.keys(gameState.warehouse).filter(key => gameState.warehouse[key] > 0);
        if (items.length === 0) {
            warehouseList.innerHTML = '<li>Склад пуст</li>';
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
        const growTimeInSeconds = plantInfo.growTime / 1000;
        let remainingTime = growTimeInSeconds;

    // 1. Создаем элементы для ростка и таймера
        bed.innerHTML = ''; // Очищаем грядку на всякий случай
        const plantElement = document.createElement('div');
        plantElement.classList.add('plant');
        plantElement.innerText = '🌱'; // Росток

        const timerElement = document.createElement('div');
        timerElement.classList.add('plant-timer'); // Новый класс для стилизации

        bed.appendChild(plantElement);
        bed.appendChild(timerElement);

    // 2. Функция для форматирования времени в формат ММ:СС
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        }

        timerElement.innerText = formatTime(remainingTime); // Сразу показываем время

    // 3. Запускаем интервал, который обновляется каждую секунду
        const timerInterval = setInterval(() => {
            remainingTime--;
            timerElement.innerText = formatTime(remainingTime);

        // 4. Когда время вышло
            if (remainingTime <= 0) {
                clearInterval(timerInterval); // Останавливаем таймер
                bed.removeChild(timerElement); // Удаляем элемент таймера
            
                plantElement.innerText = seed; // Показываем спелый овощ
            
            // Добавляем возможность собрать урожай
                plantElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    animateHarvest(plantElement, seed);
                    gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
                    saveGameData();
                    bed.innerHTML = ''; // Очищаем грядку после сбора
                    tg.HapticFeedback.notificationOccurred('success');
                }, { once: true });
            }
        }, 1000); // 1000 мс = 1 секунда
    }
    
    
    function animateHarvest(startElement, seed) {
        const endElement = document.getElementById('nav-warehouse'); // Цель анимации
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
    
        const numItems = availableSeeds.length;
        const itemVisualWidth = 65;
        const screenEdgePadding = 25; 

    // --- Шаг 1: Рассчитываем динамический радиус (логика без изменений) ---
        const rect = bed.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const maxRadiusByPosition = Math.min(centerX, window.innerWidth - centerX) - screenEdgePadding;
        const idealCircumference = numItems * itemVisualWidth;
        let idealRadius = idealCircumference / (2 * Math.PI);
        if (numItems === 2) { idealRadius = 50; }
        const finalRadius = Math.max(55, Math.min(maxRadiusByPosition, idealRadius));

    // --- Шаг 2: НОВАЯ ЛОГИКА "УМНОГО ПОВОРОТА" ---
        const angleStep = (2 * Math.PI) / numItems;
        let angleOffset = -Math.PI / 2; // Начинаем с иконки наверху (угол -90 градусов)

    // Проверяем, не выходит ли круг за пределы экрана
        const isTooFarRight = centerX + finalRadius > window.innerWidth - screenEdgePadding;
        const isTooFarLeft = centerX - finalRadius < screenEdgePadding;

    // Если круг упирается в левый или правый край...
        if (isTooFarLeft || isTooFarRight) {
        // ...поворачиваем всё меню на половину шага между иконками.
        // Это поместит "пустое" место точно на горизонтальную линию, уводя иконки вверх и вниз.
            angleOffset += angleStep / 2;
        }  
    
    // --- Шаг 3: Генерируем иконки с учетом поворота ---
        availableSeeds.forEach((seed, index) => {
        // Применяем вычисленный сдвиг угла
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

    // Остальная часть функции без изменений
        const closeButton = document.createElement('div');
        closeButton.className = 'seed-menu-close-button';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            hideSeedMenu();
        });
        seedMenu.appendChild(closeButton);

        seedMenu.style.left = `${centerX}px`;
        seedMenu.style.top = `${rect.top + rect.height / 2}px`;
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
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });

    // --- ЗАПУСК ИГРЫ ---
    loadGameData();

}); // <-- ЭТО САМАЯ ВАЖНАЯ ЗАКРЫВАЮЩАЯ СКОБКА. ВЕСЬ КОД ДОЛЖЕН БЫТЬ ВНУТРИ.

// ЗАКОНЧИТЕ КОПИРОВАТЬ ЗДЕСЬ
