// НАЧНИТЕ КОПИРОВАТЬ ОТСЮДА

document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();


    const PLANT_DATA = {
    // --- БАЗОВЫЕ КУЛЬТУРЫ (быстрые и дешевые) ---
        '🥕': { name: 'Морковь', growTime: 1000, seedCost: 1.00, sellPrice: 1.54 },
        '🍅': { name: 'Помидор', growTime: 3000, seedCost: 3.00, sellPrice: 4.62 },
        '🍆': { name: 'Баклажан', growTime: 5000, seedCost: 5.00, sellPrice: 7.70 },
        '🌽': { name: 'Кукуруза', growTime: 7000, seedCost: 7.00, sellPrice: 10.78 },
        '🥒': { name: 'Огурец', growTime: 8500, seedCost: 8.00, sellPrice: 12.32 },
        '🍓': { name: 'Клубника', growTime: 10000, seedCost: 10.00, sellPrice: 15.40 },
    
    // --- СРЕДНИЕ КУЛЬТУРЫ (хороший баланс) ---
        '🥔': { name: 'Картофель', growTime: 12000, seedCost: 12.00, sellPrice: 18.48 },
        '🌶️': { name: 'Перец', growTime: 14000, seedCost: 14.00, sellPrice: 21.56 },
        '🥬': { name: 'Салат', growTime: 16000, seedCost: 16.00, sellPrice: 24.64 },
        '🧅': { name: 'Лук', growTime: 18000, seedCost: 18.00, sellPrice: 27.72 },
        '🥦': { name: 'Брокколи', growTime: 20000, seedCost: 20.00, sellPrice: 30.80 },
    
    // --- ПРОДВИНУТЫЕ КУЛЬТУРЫ (медленные, но прибыльные) ---
        '🍉': { name: 'Арбуз', growTime: 24000, seedCost: 24.00, sellPrice: 36.96 },
        '🍇': { name: 'Виноград', growTime: 28000, seedCost: 28.00, sellPrice: 43.12 },
        '🍑': { name: 'Персик', growTime: 32000, seedCost: 32.00, sellPrice: 49.28 },
        '🍊': { name: 'Апельсин', growTime: 36000, seedCost: 36.00, sellPrice: 55.44 },
        '🥭': { name: 'Манго', growTime: 40000, seedCost: 40.00, sellPrice: 61.60 }
    };
    let gameState = {
        balance: 100,
        warehouse: {},
        seedInventory: { '🥕': 3, '🍅': 1, '🍆': 1, '🌽': 1, '🍓': 1 }, // Добавил семян для тестов
        items: {},
        unlockedBeds: 3
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
            if (!gameState.unlockedBeds) gameState.unlockedBeds = 3; // По умолчанию 3 грядки
        }
        updateBalanceDisplay();
        updateGardenBeds(); // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
    }
    function updateBalanceDisplay() { balanceAmountElement.innerText = gameState.balance.toFixed(2); }

    function getBedPrice(bedIndex) {
    // Первые 3 грядки бесплатны, дальше цена растет
        if (bedIndex < 3) return 0;
    
    // Формула: базовая цена 100 + 50 за каждую следующую грядку
        const basePrice = 100;
        const increment = 50;
        return basePrice + (bedIndex - 3) * increment;
    // Грядка 4 = 100, грядка 5 = 150, грядка 6 = 200, и т.д.
    }

    // ДОБАВЬТЕ ЭТУ НОВУЮ ФУНКЦИЮ:
    function updateGardenBeds() {
        const beds = document.querySelectorAll('.garden-bed');
    
        beds.forEach((bed, index) => {
            if (index < gameState.unlockedBeds) {
                // Грядка разблокирована
                bed.classList.remove('locked');
                bed.classList.add('available');
                bed.innerHTML = ''; // Очищаем содержимое
            } else {
            // Грядка заблокирована
                bed.classList.remove('available');
                bed.classList.add('locked');
            
                const price = getBedPrice(index);
                bed.innerHTML = `<div class="bed-lock-overlay">
                    <div class="bed-lock-icon">🔒</div>
                    <div class="bed-price">${price} 🪙</div>
                </div>`;
            }
        });
    }

    
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
        const bed = event.target.closest('.garden-bed');
        if (!bed) return;
    
        const bedIndex = Array.from(document.querySelectorAll('.garden-bed')).indexOf(bed);
    
    // Если грядка заблокирована - пытаемся купить
        if (bed.classList.contains('locked')) {
            const price = getBedPrice(bedIndex);
        
            if (gameState.balance < price) {
                tg.showAlert(`Недостаточно монет! Нужно: ${price} 🪙`);
                return;
            }
        
        // Покупаем грядку
            gameState.balance -= price;
            gameState.unlockedBeds = bedIndex + 1;
            updateBalanceDisplay();
            updateGardenBeds();
            saveGameData();
            tg.HapticFeedback.notificationOccurred('success');
            tg.showPopup({ 
                title: 'Грядка куплена!', 
                message: `Вы открыли новую грядку за ${price} монет.` 
            });
            return;
        }
    
    // Если грядка доступна и пустая - показываем меню посадки
        if (bed.classList.contains('available') && bed.innerHTML === '') {
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
    // Сбрасываем все вкладки
                if (shopTabsContainer) {
                    shopTabsContainer.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
                }
                tabContents.forEach(content => content.classList.remove('active'));
    
    // Делаем активной вкладку "Семена"
                const seedsTabButton = shopTabsContainer.querySelector('.tab-button[data-tab="seeds"]');
                if (seedsTabButton) seedsTabButton.classList.add('active');
                const seedsTabContent = document.getElementById('seeds-tab');
                if (seedsTabContent) seedsTabContent.classList.add('active');
    
    // Загружаем только семена
                populateShopSeeds();
    // УДАЛИЛИ ВЫЗОВ populateShopTabs();
    
                shopModal.classList.remove('hidden');
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
                if (tabId === 'inventory') {
                    showHybridLab();
                }
            }
        });
    }

    // Универсальный обработчик покупок
    shopModal.addEventListener('click', (e) => {
        if (!e.target.classList.contains('buy-button') || e.target.disabled) return;
    
        const button = e.target;
        const seedId = button.dataset.seed;
    
        if (!seedId) return; // Если это не семена, ничего не делаем
    
        const plant = PLANT_DATA[seedId];
        const price = plant.seedCost;
    
        if (gameState.balance < price) {
            tg.showAlert('Недостаточно монет!');
            return;
        }
    
    // Покупка
        gameState.balance -= price;
        gameState.seedInventory[seedId] = (gameState.seedInventory[seedId] || 0) + 1;
    
    // Обновление интерфейса
        document.getElementById(`inv-count-${seedId}`).innerText = `В наличии: ${gameState.seedInventory[seedId]}`;
        updateBalanceDisplay();
        saveGameData();
        tg.HapticFeedback.notificationOccurred('success');
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

// ДОБАВЬТЕ ЭТУ ФУНКЦИЮ В script.js:

// ЗАМЕНИТЕ ВСЮ ФУНКЦИЮ showHybridLab() НА ЭТУ ВЕРСИЮ:
function showHybridLab() {
    const labContainer = document.getElementById('inventory-tab');
    if (!labContainer) return;
    
    let selectedSeed1 = null;
    let selectedSeed2 = null;
    
    labContainer.innerHTML = `
        <div style="padding: 15px; text-align: center;">
            <h3 style="margin: 10px 0; font-family: 'Nunito', Arial, sans-serif;">🧪 Лаборатория Гибридов</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">
                Выберите два семени для скрещивания
            </p>
            
            <!-- Выбранные семена -->
            <div style="display: flex; gap: 10px; justify-content: center; align-items: center; margin: 20px 0;">
                <div id="selected-seed-1" style="
                    width: 80px; 
                    height: 80px; 
                    border: 3px dashed #ccc; 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    font-size: 40px;
                    background: #f9f9f9;
                    cursor: pointer;
                " onclick="openSeedSelector(1)">
                    ?
                </div>
                <span style="font-size: 24px; color: #999;">+</span>
                <div id="selected-seed-2" style="
                    width: 80px; 
                    height: 80px; 
                    border: 3px dashed #ccc; 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    font-size: 40px;
                    background: #f9f9f9;
                    cursor: pointer;
                " onclick="openSeedSelector(2)">
                    ?
                </div>
            </div>
            
            <!-- Список доступных семян -->
            <div id="seed-selector-panel" style="display: none; margin: 20px 0;">
                <p style="font-size: 13px; color: #555; margin-bottom: 10px;">
                    <strong>Выберите семя:</strong>
                </p>
                <div id="seed-grid" style="
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 8px; 
                    max-height: 250px; 
                    overflow-y: auto;
                    padding: 10px;
                    background: #f5f5f5;
                    border-radius: 10px;
                "></div>
            </div>
            
            <button id="hybrid-create-btn" style="
                background-color: #4CAF50; 
                color: white; 
                padding: 12px 30px; 
                border: none; 
                border-radius: 8px; 
                font-size: 16px; 
                cursor: pointer;
                font-weight: bold;
                font-family: 'Nunito', Arial, sans-serif;
                margin-top: 10px;
            ">Скрестить (50 🪙)</button>
            
            <div id="hybrid-result" style="margin-top: 20px; font-size: 14px;"></div>
        </div>
    `;
    
    // Функция открытия селектора семян
    window.openSeedSelector = function(slotNumber) {
        const selectorPanel = document.getElementById('seed-selector-panel');
        const seedGrid = document.getElementById('seed-grid');
        
        // Переключаем видимость панели
        if (selectorPanel.style.display === 'none') {
            selectorPanel.style.display = 'block';
            selectorPanel.dataset.currentSlot = slotNumber;
            
            // Заполняем сетку семенами
            seedGrid.innerHTML = '';
            
            // Добавляем обычные семена
            Object.keys(PLANT_DATA).forEach(seed => {
                if (gameState.seedInventory[seed] > 0) {
                    const plant = PLANT_DATA[seed];
                    const seedCard = document.createElement('div');
                    seedCard.style.cssText = `
                        background: white;
                        border: 2px solid #ddd;
                        border-radius: 10px;
                        padding: 8px;
                        cursor: pointer;
                        text-align: center;
                        transition: transform 0.2s, border-color 0.2s;
                    `;
                    seedCard.innerHTML = `
                        <div style="font-size: 32px;">${seed}</div>
                        <div style="font-size: 10px; color: #666; margin-top: 2px;">${plant.name}</div>
                        <div style="font-size: 9px; color: #999;">${gameState.seedInventory[seed]} шт</div>
                    `;
                    seedCard.onmouseover = () => {
                        seedCard.style.transform = 'scale(1.05)';
                        seedCard.style.borderColor = '#4CAF50';
                    };
                    seedCard.onmouseout = () => {
                        seedCard.style.transform = 'scale(1)';
                        seedCard.style.borderColor = '#ddd';
                    };
                    seedCard.onclick = () => selectSeed(seed, slotNumber);
                    seedGrid.appendChild(seedCard);
                }
            });
            
            // Добавляем гибриды, если они есть
            Object.keys(HYBRID_DATA).forEach(hybrid => {
                if (gameState.seedInventory[hybrid] > 0) {
                    const seedCard = document.createElement('div');
                    seedCard.style.cssText = `
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: 2px solid #5568d3;
                        border-radius: 10px;
                        padding: 8px;
                        cursor: pointer;
                        text-align: center;
                        transition: transform 0.2s;
                        color: white;
                    `;
                    seedCard.innerHTML = `
                        <div style="font-size: 32px;">${hybrid}</div>
                        <div style="font-size: 10px; margin-top: 2px;">Гибрид</div>
                        <div style="font-size: 9px; opacity: 0.9;">${gameState.seedInventory[hybrid]} шт</div>
                    `;
                    seedCard.onmouseover = () => seedCard.style.transform = 'scale(1.05)';
                    seedCard.onmouseout = () => seedCard.style.transform = 'scale(1)';
                    seedCard.onclick = () => selectSeed(hybrid, slotNumber);
                    seedGrid.appendChild(seedCard);
                }
            });
        } else {
            selectorPanel.style.display = 'none';
        }
    };
    
    // Функция выбора семени
    window.selectSeed = function(seed, slotNumber) {
        if (slotNumber === 1) {
            selectedSeed1 = seed;
            document.getElementById('selected-seed-1').innerHTML = `
                <div style="font-size: 50px;">${seed}</div>
            `;
            document.getElementById('selected-seed-1').style.borderColor = '#4CAF50';
            document.getElementById('selected-seed-1').style.borderStyle = 'solid';
        } else {
            selectedSeed2 = seed;
            document.getElementById('selected-seed-2').innerHTML = `
                <div style="font-size: 50px;">${seed}</div>
            `;
            document.getElementById('selected-seed-2').style.borderColor = '#4CAF50';
            document.getElementById('selected-seed-2').style.borderStyle = 'solid';
        }
        
        // Скрываем панель выбора
        document.getElementById('seed-selector-panel').style.display = 'none';
    };
    
    // Обработчик кнопки скрещивания
    document.getElementById('hybrid-create-btn').addEventListener('click', () => {
        const resultDiv = document.getElementById('hybrid-result');
        const hybridCost = 50;
        
        if (!selectedSeed1 || !selectedSeed2) {
            resultDiv.innerHTML = '<span style="color: red;">❌ Выберите оба семени!</span>';
            return;
        }
        
        if (selectedSeed1 === selectedSeed2) {
            resultDiv.innerHTML = '<span style="color: red;">❌ Нельзя скрестить одинаковые!</span>';
            return;
        }
        
        if (gameState.balance < hybridCost) {
            resultDiv.innerHTML = '<span style="color: red;">❌ Нужно 50 🪙!</span>';
            return;
        }
        
        if (!gameState.seedInventory[selectedSeed1] || !gameState.seedInventory[selectedSeed2]) {
            resultDiv.innerHTML = '<span style="color: red;">❌ Недостаточно семян!</span>';
            return;
        }
        
        const recipe = getHybridRecipe(selectedSeed1, selectedSeed2);
        
        if (!recipe) {
            resultDiv.innerHTML = '<span style="color: orange;">⚠️ Комбинация невозможна!</span>';
            return;
        }
        
        // Проводим скрещивание
        gameState.balance -= hybridCost;
        gameState.seedInventory[selectedSeed1]--;
        gameState.seedInventory[selectedSeed2]--;
        gameState.seedInventory[recipe.result] = (gameState.seedInventory[recipe.result] || 0) + 1;
        
        updateBalanceDisplay();
        saveGameData();
        tg.HapticFeedback.notificationOccurred('success');
        
        resultDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 15px; 
                border-radius: 12px;
                animation: pulse 0.5s;
            ">
                ✨ <strong>Получен гибрид!</strong><br>
                ${recipe.result} <strong>${recipe.name}</strong>
            </div>
        `;
        
        // Перезагружаем интерфейс через 1.5 секунды
        setTimeout(() => showHybridLab(), 1500);
    });
}


// ТАКЖЕ ОБНОВИТЕ ФУНКЦИЮ plantSeed, ДОБАВИВ ПРОВЕРКУ ГИБРИДОВ:
function plantSeed(bed, seed) {
    // Ищем данные в обычных растениях или гибридах
    const plantInfo = PLANT_DATA[seed] || getHybridData(seed);
    if (!plantInfo) return;
    
    // Остальной код функции plantSeed остается без изменений...
}
