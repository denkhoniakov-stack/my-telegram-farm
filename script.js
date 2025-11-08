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
            tg.showAlert(`Грядка куплена! Вы открыли новую грядку за ${price} монет.`);
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
    
        Object.keys(gameState.warehouse).forEach(crop => {
            const quantity = gameState.warehouse[crop];
            if (quantity > 0) {
            // Проверяем, гибрид это или обычный овощ
                const plant = PLANT_DATA[crop];
                const hybrid = getHybridData ? getHybridData(crop) : null;
            
                if (plant) {
                     totalProfit += quantity * plant.sellPrice;
                } else if (hybrid) {
                    totalProfit += quantity * hybrid.sellPrice;
                }
            }
        });
    
        if (totalProfit === 0) return;
    
        gameState.balance += totalProfit;
        gameState.warehouse = {};
        saveGameData();
        updateBalanceDisplay();
        updateWarehouseDisplay();
    
        tg.showAlert(`Урожай продан! Вы заработали ${totalProfit.toFixed(2)} монет ${totalProfit > 100 ? '🎉' : ''}`);
    });   
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });

     
     

    function showHybridLab() {
        const labContainer = document.getElementById('inventory-tab');
        if (!labContainer) {
            console.error('Не найден элемент inventory-tab');
            return;
        }
    
        let crop1 = null;
        let crop2 = null;
    
        labContainer.innerHTML = `
            <div style="padding: 20px; font-family: 'Nunito', Arial, sans-serif; background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; margin: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">🧪</div>
                    <h3 style="margin: 0; color: #2c3e50; font-size: 22px;">Лаборатория Гибридов</h3>
                    <p style="font-size: 12px; color: #6c757d; margin: 8px 0;">
                        Выберите два овоща для создания уникального гибрида
                    </p>
                </div>
            
                <!-- Слоты для выбранных овощей -->
                <div style="
                    display: flex; 
                    gap: 15px; 
                    justify-content: center; 
                    align-items: center; 
                    margin: 25px 0;
                    padding: 20px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.07);
                ">
                    <div id="slot1" style="
                        width: 85px; 
                        height: 85px; 
                        border: 3px dashed #dee2e6; 
                        border-radius: 15px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 45px;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
                    ">?</div>
                
                    <div style="
                     font-size: 28px; 
                     color: #adb5bd;
                     font-weight: bold;
                    ">+</div>
                
                    <div id="slot2" style="
                     width: 85px; 
                     height: 85px; 
                     border: 3px dashed #dee2e6; 
                     border-radius: 15px; 
                     display: flex; 
                     align-items: center; 
                     justify-content: center;
                     font-size: 45px;
                     background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                     cursor: pointer;
                     transition: all 0.3s;
                     box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
                    ">?</div>
                </div>
            
                <!-- Заголовок списка -->
                <div style="
                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                 color: white;
                 padding: 10px 15px;
                 border-radius: 10px 10px 0 0;
                 font-weight: bold;
                 font-size: 14px;
                 display: flex;
                 align-items: center;
                 gap: 8px;
                ">
                    <span style="font-size: 18px;">🌾</span>
                    <span>Овощи на складе</span>
                </div>
            
                <!-- Сетка овощей -->
                <div id="cropsList" style="
                 display: grid; 
                 grid-template-columns: repeat(4, 1fr); 
                 gap: 10px; 
                 padding: 15px;
                 background: white;
                 border-radius: 0 0 10px 10px;
                 max-height: 300px; 
                 overflow-y: auto;
                 box-shadow: 0 4px 6px rgba(0,0,0,0.07);
                "></div>
            
                <!-- Кнопка скрещивания -->
                <button id="mixBtn" style="
                 width: 100%; 
                 padding: 15px; 
                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                 color: white; 
                 border: none; 
                 border-radius: 12px; 
                 font-size: 16px; 
                 font-weight: bold; 
                 cursor: pointer;
                 margin-top: 20px;
                 box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                 transition: all 0.3s;
                 font-family: 'Nunito', Arial, sans-serif;
                ">✨ Скрестить за 50 🪙</button>
            
                <!-- Сообщение о результате -->
                <div id="msg" style="margin-top: 15px; text-align: center; min-height: 20px;"></div>
            </div>
        `;
    
        const slot1El = document.getElementById('slot1');
        const slot2El = document.getElementById('slot2');
        const cropsListEl = document.getElementById('cropsList');
        const mixBtn = document.getElementById('mixBtn');
        const msgEl = document.getElementById('msg');
    
    // Добавляем эффект наведения на кнопку
        mixBtn.onmouseover = () => {
            mixBtn.style.transform = 'translateY(-2px)';
            mixBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        };
        mixBtn.onmouseout = () => {
            mixBtn.style.transform = 'translateY(0)';
            mixBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        };
    
    // Получаем овощи со склада
        const crops = [];
        for (let key in gameState.warehouse) {
            if (gameState.warehouse[key] > 0) {
                crops.push(key);
            }
        }
    
        if (crops.length === 0) {
            cropsListEl.innerHTML = `
                <div style="
                 grid-column: 1/-1; 
                 text-align: center; 
                 color: #adb5bd; 
                 padding: 40px 20px;
                 font-size: 14px;
                ">
                    <div style="font-size: 48px; margin-bottom: 10px; opacity: 0.5;">📦</div>
                    <div style="font-weight: bold; margin-bottom: 5px;">Склад пуст</div>
                    <div style="font-size: 12px;">Вырастите овощи на грядках</div>
                </div>
            `;
            return;
        }
    
    // Создаем красивые карточки овощей
        crops.forEach(crop => {
            const plant = PLANT_DATA[crop];
            const hybrid = getHybridData ? getHybridData(crop) : null;
        
            if (!plant && !hybrid) return;
        
            const isHybrid = !!hybrid;
            const name = plant ? plant.name : (hybrid ? 'Гибрид' : 'Овощ');
        
            const card = document.createElement('div');
            card.style.cssText = `
             background: ${isHybrid ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
             border: 2px solid ${isHybrid ? '#5a67d8' : '#e9ecef'};
             border-radius: 12px;
             padding: 10px;
             text-align: center;
             cursor: pointer;
             transition: all 0.3s;
             box-shadow: 0 2px 4px rgba(0,0,0,0.08);
             position: relative;
             overflow: hidden;
            `;
        
            card.innerHTML = `
                <div style="font-size: 36px; margin-bottom: 5px;">${crop}</div>
                <div style="
                    font-size: 9px; 
                    color: ${isHybrid ? 'rgba(255,255,255,0.9)' : '#6c757d'}; 
                    font-weight: ${isHybrid ? 'bold' : 'normal'};
                    margin-bottom: 3px;
                ">${name}</div>
                <div style="
                    font-size: 8px; 
                    color: ${isHybrid ? 'rgba(255,255,255,0.8)' : '#adb5bd'};
                    background: ${isHybrid ? 'rgba(255,255,255,0.2)' : '#f8f9fa'};
                    padding: 2px 6px;
                    border-radius: 8px;
                    display: inline-block;
                ">${gameState.warehouse[crop]} шт</div>
            `;
        
        // Эффекты наведения
            card.onmouseover = function() {
                card.style.transform = 'translateY(-5px) scale(1.05)';
                card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                card.style.borderColor = isHybrid ? '#4c51bf' : '#667eea';
            };
        
            card.onmouseout = function() {
             card.style.transform = 'translateY(0) scale(1)';
             card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
             card.style.borderColor = isHybrid ? '#5a67d8' : '#e9ecef';
            };
        
        // Обработчик выбора
            card.onclick = function() {
                if (!crop1) {
                 crop1 = crop;
                 slot1El.innerHTML = `<div style="font-size: 50px;">${crop}</div>`;
                 slot1El.style.borderColor = '#667eea';
                 slot1El.style.borderStyle = 'solid';
                 slot1El.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
                 slot1El.style.transform = 'scale(1.05)';
                } else if (!crop2) {
                 crop2 = crop;
                 slot2El.innerHTML = `<div style="font-size: 50px;">${crop}</div>`;
                 slot2El.style.borderColor = '#667eea';
                 slot2El.style.borderStyle = 'solid';
                 slot2El.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
                 slot2El.style.transform = 'scale(1.05)';
                }
            };
        
            cropsListEl.appendChild(card);
        });
    
    // Сброс слотов при клике
        slot1El.onclick = function() {
         crop1 = null;
         slot1El.innerHTML = '?';
         slot1El.style.borderColor = '#dee2e6';
         slot1El.style.borderStyle = 'dashed';
         slot1El.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
         slot1El.style.transform = 'scale(1)';
        };
    
        slot2El.onclick = function() {
         crop2 = null;
         slot2El.innerHTML = '?';
         slot2El.style.borderColor = '#dee2e6';
         slot2El.style.borderStyle = 'dashed';
         slot2El.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
         slot2El.style.transform = 'scale(1)';
        };
    
    // Обработчик скрещивания
        mixBtn.onclick = function() {
            if (!crop1 || !crop2) {
                msgEl.innerHTML = '<div style="color: #dc3545; font-weight: bold; animation: shake 0.5s;">❌ Выберите два овоща!</div>';
                return;
            }
            if (crop1 === crop2) {
                msgEl.innerHTML = '<div style="color: #fd7e14; font-weight: bold;">⚠️ Нельзя скрестить одинаковые овощи!</div>';
                return;
            }
            if (gameState.balance < 50) {
                msgEl.innerHTML = '<div style="color: #dc3545; font-weight: bold;">💰 Недостаточно монет! Нужно 50 🪙</div>';
                return;
            }
        
            if (typeof getHybridRecipe !== 'function') {
                msgEl.innerHTML = '<div style="color: #dc3545;">❌ Файл hybrids.js не подключен!</div>';
                return;
            }
        
            const recipe = getHybridRecipe(crop1, crop2);
        
            if (!recipe) {
                msgEl.innerHTML = '<div style="color: #fd7e14; font-weight: bold;">🔬 Эта комбинация не дает гибрида. Попробуйте другую!</div>';
                return;
            }
        
        // ИСПРАВЛЕНИЕ: Гибрид теперь идет на склад, а не в семена
            gameState.balance -= 50;
            gameState.warehouse[crop1]--;
            gameState.warehouse[crop2]--;
            gameState.warehouse[recipe.result] = (gameState.warehouse[recipe.result] || 0) + 1;
        
            updateBalanceDisplay();
            saveGameData();
            tg.HapticFeedback.notificationOccurred('success');
        
            msgEl.innerHTML = `
                <div style="
                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                 color: white; 
                 padding: 15px; 
                 border-radius: 12px;
                 animation: fadeIn 0.5s;
                 box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                ">
                    <div style="font-size: 36px; margin-bottom: 5px;">✨</div>
                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Получен гибрид!</div>
                    <div style="font-size: 20px; margin: 8px 0;">${recipe.result}</div>
                    <div style="font-size: 14px; opacity: 0.95;">${recipe.name}</div>
                    <div style="font-size: 11px; opacity: 0.85; margin-top: 8px;">Проверьте склад урожая!</div>
                </div>
            `;
        
            setTimeout(() => showHybridLab(), 2500);
        };
    }

    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';
    
        const regularCrops = {}; // Обычные овощи
        const hybridCrops = {};  // Гибридные овощи
    
    // Разделяем овощи на обычные и гибридные
        Object.keys(gameState.warehouse).forEach(crop => {
            if (gameState.warehouse[crop] > 0) {
            // Проверяем, является ли овощ гибридом
                if (getHybridData && getHybridData(crop)) {
                    hybridCrops[crop] = gameState.warehouse[crop];
                } else {
                    regularCrops[crop] = gameState.warehouse[crop];
                }
            }
        });
    
        const hasRegular = Object.keys(regularCrops).length > 0;
        const hasHybrid = Object.keys(hybridCrops).length > 0;
    
        if (!hasRegular && !hasHybrid) {
            warehouseList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">Склад урожая пуст</li>';
            sellAllButton.style.display = 'none';
            return;
        }
    
        sellAllButton.style.display = 'block';
    
    // Показываем обычные овощи
        if (hasRegular) {
            const regularHeader = document.createElement('li');
            regularHeader.style.cssText = 'font-weight: bold; color: #4CAF50; margin-top: 10px; padding: 5px 0; border-bottom: 2px solid #4CAF50;';
            regularHeader.textContent = '🌱 Обычные овощи';
            warehouseList.appendChild(regularHeader);
        
            Object.keys(regularCrops).forEach(crop => {
                const plant = PLANT_DATA[crop];
                const li = document.createElement('li');
                li.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0;';
                li.innerHTML = `
                    <span>${crop} ${plant.name}</span>
                    <span>${regularCrops[crop]} шт (${(plant.sellPrice * regularCrops[crop]).toFixed(2)} 🪙)</span>
                `;
                warehouseList.appendChild(li);
            });
        }
    
    // Показываем гибридные овощи
        if (hasHybrid) {
            const hybridHeader = document.createElement('li');
            hybridHeader.style.cssText = 'font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); color: white; margin-top: 15px; padding: 8px; border-radius: 8px;';
            hybridHeader.textContent = '✨ Гибридные овощи';
            warehouseList.appendChild(hybridHeader);
        
            Object.keys(hybridCrops).forEach(crop => {
                const hybridInfo = getHybridData(crop);
                const li = document.createElement('li');
                li.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; background: rgba(102, 126, 234, 0.1); margin: 4px 0; border-radius: 5px; padding-left: 10px;';
                li.innerHTML = `
                    <span>${crop} <strong>${hybridInfo ? HYBRID_RECIPES_FULL[Object.keys(HYBRID_RECIPES_FULL).find(k => HYBRID_RECIPES_FULL[k].result === crop)]?.name || 'Гибрид' : 'Гибрид'}</strong></span>
                    <span style="color: #667eea; font-weight: bold;">${hybridCrops[crop]} шт (${(hybridInfo.sellPrice * hybridCrops[crop]).toFixed(2)} 🪙)</span>
                `;
                warehouseList.appendChild(li);
            });
        }
    }

setTimeout(() => updateGardenBeds(), 100);    
});


