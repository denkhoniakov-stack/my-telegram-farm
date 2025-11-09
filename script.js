// НАЧНИТЕ КОПИРОВАТЬ ОТСЮДА

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // ✅ ЭМУЛЯТОР TELEGRAM API ДЛЯ ЛОКАЛЬНОЙ РАЗРАБОТКИ
    // ========================================
    let tg;
    if (typeof window.Telegram === 'undefined' || typeof window.Telegram.WebApp === 'undefined') {
        console.warn("Режим локальной разработки: API Telegram не найдено. Используется эмулятор.");
        tg = {
            initDataUnsafe: { user: { id: 12345, first_name: "Local", last_name: "User", username: "localuser" } },
            ready: () => console.log("Эмулятор TG: ready()"),
            expand: () => console.log("Эмулятор TG: expand()"),
            showAlert: (message) => alert(message),
            showPopup: (options) => alert(options.message),
            showConfirm: (message, callback) => {
                const result = confirm(message);
                if (callback) callback(result);
            },
            HapticFeedback: {
                notificationOccurred: (type) => console.log(`Эмулятор тактильной отдачи: ${type}`)
            },
            CloudStorage: {
                setItem: (key, value, callback) => {
                    localStorage.setItem(key, value);
                    if (callback) callback(null);
                },
                getItem: (key, callback) => {
                    const value = localStorage.getItem(key);
                    if (callback) callback(null, value);
                },
                removeItem: (key, callback) => {
                    localStorage.removeItem(key);
                    if (callback) callback(null);
                }
            }
        };
    } else {
        tg = window.Telegram.WebApp;
    }
    
    tg.ready();
    tg.expand();
    const ADMIN_ID = 522564845; // ЗАМЕНИТЕ НА ВАШ TELEGRAM USER ID
    const isAdmin = tg.initDataUnsafe?.user?.id === ADMIN_ID;


    function showAlert(message) {
        if (tg.showAlert && typeof tg.showAlert === 'function') {
            tg.showAlert(message);
        } else {
            alert(message);
        }
    }


    function showPopup(options) {
        if (tg.showPopup && typeof tg.showPopup === 'function') {
            tg.showPopup(options);
        } else {
            alert(options.message);
        }
    }


    function hapticFeedback(type) {
        if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
            tg.HapticFeedback.notificationOccurred(type);
        }
    }



    const PLANT_DATA = {
    // --- БАЗОВЫЕ КУЛЬТУРЫ (быстрые и дешевые) ---
        '🥕': { name: 'Морковь', growTime: 1, seedCost: 1.00, sellPrice: 1.54 },
        '🍅': { name: 'Помидор', growTime: 3, seedCost: 3.00, sellPrice: 4.62 },
        '🍆': { name: 'Баклажан', growTime: 5, seedCost: 5.00, sellPrice: 7.70 },
        '🌽': { name: 'Кукуруза', growTime: 7, seedCost: 7.00, sellPrice: 10.78 },
        '🥒': { name: 'Огурец', growTime: 9, seedCost: 8.00, sellPrice: 12.32 },
        '🍓': { name: 'Клубника', growTime: 10, seedCost: 10.00, sellPrice: 15.40 },

        // --- СРЕДНИЕ КУЛЬТУРЫ (хороший баланс) ---
        '🥔': { name: 'Картофель', growTime: 12, seedCost: 12.00, sellPrice: 18.48 },
        '🌶️': { name: 'Перец', growTime: 14, seedCost: 14.00, sellPrice: 21.56 },
        '🥬': { name: 'Салат', growTime: 16, seedCost: 16.00, sellPrice: 24.64 },
        '🧅': { name: 'Лук', growTime: 18, seedCost: 18.00, sellPrice: 27.72 },
        '🥦': { name: 'Брокколи', growTime: 20, seedCost: 20.00, sellPrice: 30.80 },

        // --- ПРОДВИНУТЫЕ КУЛЬТУРЫ (медленные, но прибыльные) ---
        '🍉': { name: 'Арбуз', growTime: 24, seedCost: 24.00, sellPrice: 36.96 },
        '🍇': { name: 'Виноград', growTime: 28, seedCost: 28.00, sellPrice: 43.12 },
        '🍑': { name: 'Персик', growTime: 32, seedCost: 32.00, sellPrice: 49.28 },
        '🍊': { name: 'Апельсин', growTime: 36, seedCost: 36.00, sellPrice: 55.44 },
        '🥭': { name: 'Манго', growTime: 40, seedCost: 40.00, sellPrice: 61.60 }
    };

    let gameState = {
        balance: 100,
        warehouse: {},
        seedInventory: { '🥕': 3, '🍅': 1, '🍆': 1, '🌽': 1, '🍓': 1 }, // Добавил семян для тестов
        items: {},
        unlockedBeds: 3,
        hybridMixings: {     // ✅ ДОБАВЬТЕ ЭТО
           epic: null,
           legendary: null,
           mythic: null
        },
        garden: [],
        discoveredHybrids: [],
        hybridData: {} 
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
    // ✅ ИСПРАВЛЕНИЕ: Добавляем initializeGame
    function initializeGame() {
        updateBalanceDisplay();
        updateGardenBeds();
        updateGardenDisplay();
        updateWarehouseDisplay();
    }

    // ✅ ИСПРАВЛЕНИЕ: loadGameData теперь принимает callback
    function loadGameData(callback) {
    // Проверяем, доступен ли CloudStorage
        if (tg.CloudStorage && typeof tg.CloudStorage.getItem === 'function') {
            // Используем Telegram Cloud Storage
            tg.CloudStorage.getItem('farmGame', (err, data) => {
                if (!err && data) {
                    try {
                        const loaded = JSON.parse(data);
                        gameState.balance = loaded.balance || 100;
                        gameState.seedInventory = loaded.seedInventory || { '🥕': 3, '🍅': 1, '🍆': 1, '🌽': 1, '🍓': 1 };
                        gameState.warehouse = loaded.warehouse || {};
                        gameState.items = loaded.items || {};
                        gameState.garden = loaded.garden || [];
                        gameState.unlockedBeds = loaded.unlockedBeds || 3;
                        gameState.discoveredHybrids = loaded.discoveredHybrids || [];
                        gameState.hybridData = loaded.hybridData || {};
                        
                        // ✅ НОВОЕ: Загружаем множественные процессы смешивания
                        if (loaded.hybridMixings !== undefined) {
                            gameState.hybridMixings = loaded.hybridMixings;
                        } else {
                            gameState.hybridMixings = {
                                epic: null,
                                legendary: null,
                                mythic: null
                            };
                        }
                        
                        // ✅ МИГРАЦИЯ: Конвертируем старый формат в новый
                        if (loaded.hybridMixing !== undefined && loaded.hybridMixing !== null) {
                            gameState.hybridMixings.epic = loaded.hybridMixing;
                        }
                    } catch (e) {
                        console.error('Ошибка загрузки:', e);
                    }
                } else {
                    // Инициализация если данных нет
                    gameState.hybridMixings = {
                        epic: null,
                        legendary: null,
                        mythic: null
                    };
                }
                callback(); // ✅ ВЫЗЫВАЕМ CALLBACK ПОСЛЕ ЗАГРУЗКИ
            });
        } else {
            // Fallback: используем localStorage для браузера
            const data = localStorage.getItem('farmGame');
            if (data) {
                try {
                    const loaded = JSON.parse(data);
                    gameState.balance = loaded.balance || 100;
                    gameState.seedInventory = loaded.seedInventory || { '🥕': 3, '🍅': 1, '🍆': 1, '🌽': 1, '🍓': 1 };
                    gameState.warehouse = loaded.warehouse || {};
                    gameState.items = loaded.items || {};
                    gameState.garden = loaded.garden || [];
                    gameState.unlockedBeds = loaded.unlockedBeds || 3;
                    gameState.discoveredHybrids = loaded.discoveredHybrids || []; 
                    gameState.hybridData = loaded.hybridData || {};
                    
                    // ✅ НОВОЕ: Загружаем множественные процессы смешивания
                    if (loaded.hybridMixings !== undefined) {
                        gameState.hybridMixings = loaded.hybridMixings;
                    } else {
                        gameState.hybridMixings = {
                            epic: null,
                            legendary: null,
                            mythic: null
                        };
                    }
                    
                    // ✅ МИГРАЦИЯ: Конвертируем старый формат в новый
                    if (loaded.hybridMixing !== undefined && loaded.hybridMixing !== null) {
                        gameState.hybridMixings.epic = loaded.hybridMixing;
                    }
                } catch (e) {
                    console.error('Ошибка:', e);
                }
            } else {
                // Инициализация если данных нет
                gameState.hybridMixings = {
                    epic: null,
                    legendary: null,
                    mythic: null
                };
            }
            callback(); // ✅ ВЫЗЫВАЕМ CALLBACK СРАЗУ ДЛЯ LOCALSTORAGE
        }
    }




    function updateBalanceDisplay() { balanceAmountElement.innerText = gameState.balance.toFixed(2); }


    


    // ДОБАВЬТЕ ЭТУ ФУНКЦИЮ ЗДЕСЬ
    function saveGameData() {
        const data = JSON.stringify(gameState);
    
    // Пробуем CloudStorage, если не работает — используем localStorage
        if (tg.CloudStorage && typeof tg.CloudStorage.setItem === 'function') {
            tg.CloudStorage.setItem('farmGame', data);
        } else {
            localStorage.setItem('farmGame', data);
        }
    }



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
                if (!bed.querySelector('.plant')) { // ✅ Проверяем, нет ли там уже растения
                    bed.innerHTML = ''; // Очищаем содержимое
                }
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


    


// ДОБАВЬТЕ ЭТУ НОВУЮ ФУНКЦИЮ
    function updateGardenDisplay() {
        clearAllTimers(); // ✅ ДОБАВЛЕНО: Очищаем все таймеры перед обновлением
        
        const beds = document.querySelectorAll('.garden-bed');
        beds.forEach((bed, index) => {
            if (index < gameState.unlockedBeds && gameState.garden[index]) {
                renderPlant(bed, index);
            }
        });
    }




    
    // --- ФИНАЛЬНАЯ ВЕРСИЯ ФУНКЦИИ ВЫБОРА СЕМЯН ---
    function showPlantingMenu(bed) {
        const availableSeeds = Object.keys(gameState.seedInventory).filter(seed => gameState.seedInventory[seed] > 0);
        if (availableSeeds.length === 0) {
            showAlert('У вас нет семян для посадки. Зайдите в магазин!');
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
            showAlert(`У вас закончились семена ${PLANT_DATA[seedType].name}!`);
        }
    }
    
    function plantSeed(bed, seed) {
        const plantInfo = PLANT_DATA[seed];
        const bedIndex = Array.from(document.querySelectorAll('.garden-bed')).indexOf(bed);

        // ✅ СОХРАНЯЕМ ТОЛЬКО seed и plantedAt
        gameState.garden[bedIndex] = {
            seed: seed,
            plantedAt: Date.now()
            // НЕ СОХРАНЯЕМ growTime - берём из PLANT_DATA
        };
        saveGameData();

        // Рендерим растение
        renderPlant(bed, bedIndex);
    }


    // ✅ НОВАЯ ФУНКЦИЯ: Очищает все активные таймеры
    function clearAllTimers() {
        const beds = document.querySelectorAll('.garden-bed');
        beds.forEach(bed => {
            const timerId = bed.getAttribute('data-timer-id');
            if (timerId) {
                clearInterval(parseInt(timerId));
                bed.removeAttribute('data-timer-id');
            }
        });
    }

    

    function renderPlant(bed, bedIndex) {
        const plantData = gameState.garden[bedIndex];
        if (!plantData) return;

        const plantInfo = PLANT_DATA[plantData.seed];
        const elapsed = Date.now() - plantData.plantedAt;
        
        // ✅ БЕРЁМ growTime ИЗ PLANT_DATA (в секундах)
        const growTimeSeconds = plantInfo.growTime;
        const remaining = Math.max(0, Math.floor(growTimeSeconds - (elapsed / 1000)));

        bed.innerHTML = '';

        const plantElement = document.createElement('div');
        plantElement.classList.add('plant');
        plantElement.innerText = remaining > 0 ? '🌱' : plantData.seed;

        if (remaining > 0) {
            const timerElement = document.createElement('div');
            timerElement.classList.add('plant-timer');
            bed.appendChild(plantElement);
            bed.appendChild(timerElement);

            let remainingTime = remaining;
            timerElement.innerText = formatTime(remainingTime);

            const timerInterval = setInterval(() => {
                remainingTime--;
                if (remainingTime >= 0) {
                    timerElement.innerText = formatTime(remainingTime);
                }
                
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    bed.removeAttribute('data-timer-id');
                    
                    if (timerElement.parentNode) {
                        bed.removeChild(timerElement);
                    }
                    plantElement.innerText = plantData.seed;
                    setupHarvest(plantElement, bed, bedIndex, plantData.seed);
                }
            }, 1000);
            
            bed.setAttribute('data-timer-id', timerInterval);
        } else {
            bed.appendChild(plantElement);
            setupHarvest(plantElement, bed, bedIndex, plantData.seed);
        }
    }




    function setupHarvest(plantElement, bed, bedIndex, seed) {
         plantElement.addEventListener('click', (e) => {
            e.stopPropagation();
            animateHarvest(plantElement, seed);
            gameState.warehouse[seed] = (gameState.warehouse[seed] || 0) + 1;
            gameState.garden[bedIndex] = null;
            saveGameData();
            bed.innerHTML = '';
            hapticFeedback('success');
        }, { once: true });
    }


    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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
                showAlert(`Недостаточно монет! Нужно: ${price} 🪙`);
                return;
            }
        
        // Покупаем грядку
            gameState.balance -= price;
            gameState.unlockedBeds = bedIndex + 1;
            updateBalanceDisplay();
            updateGardenBeds();
            saveGameData();
            hapticFeedback('success');
            showAlert(`Грядка куплена! Вы открыли новую грядку за ${price} монет.`);
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
                   initHybridLab(gameState, tg, updateBalanceDisplay, saveGameData, PLANT_DATA);
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
            showAlert('Недостаточно монет!');
            return;
        }
    
    // Покупка
        gameState.balance -= price;
        gameState.seedInventory[seedId] = (gameState.seedInventory[seedId] || 0) + 1;
    
    // Обновление интерфейса
        document.getElementById(`inv-count-${seedId}`).innerText = `В наличии: ${gameState.seedInventory[seedId]}`;
        updateBalanceDisplay();
        saveGameData();
        hapticFeedback('success');
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
                const hybrid = getHybridData(crop, gameState); // ✅ передаем gameState
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
    
        showAlert(`Урожай продан! Вы заработали ${totalProfit.toFixed(2)} монет ${totalProfit > 100 ? '🎉' : ''}`);
    });   
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
            navFarmBtn.click();
        });
    });


     
     


    


    function updateWarehouseDisplay() {
        warehouseList.innerHTML = '';

        // ✅ СЕКЦИЯ 1: Семена
        const seedsInInventory = Object.keys(gameState.seedInventory).filter(seed => gameState.seedInventory[seed] > 0);
        
        if (seedsInInventory.length > 0) {
            const seedsHeader = document.createElement('li');
            seedsHeader.style.cssText = `
                padding: 15px 10px 5px 10px;
                font-weight: bold;
                font-size: 16px;
                color: #4CAF50;
                background: rgba(76, 175, 80, 0.1);
                border-radius: 8px;
                margin-bottom: 5px;
            `;
            seedsHeader.innerHTML = '🌱 Семена';
            warehouseList.appendChild(seedsHeader);

            seedsInInventory.forEach(seedEmoji => {
                const plant = PLANT_DATA[seedEmoji];
                if (!plant) return;
                
                const count = gameState.seedInventory[seedEmoji];
                
                const li = document.createElement('li');
                li.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;
                `;
                
                li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 28px;">${seedEmoji}</span>
                        <div>
                            <div style="font-weight: bold;">${plant.name}</div>
                            <div style="font-size: 12px; color: #666;">
                                ${count} шт. • Стоимость: ${plant.seedCost.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <div style="color: #999; font-size: 14px;">
                        Семена
                    </div>
                `;
                
                warehouseList.appendChild(li);
            });
        }

        // ✅ СЕКЦИЯ 2: Обычный урожай (не гибриды)
        const harvestedItems = Object.keys(gameState.warehouse).filter(key => {
            return gameState.warehouse[key] > 0 && PLANT_DATA[key]; // Только обычные растения
        });
        
        if (harvestedItems.length > 0) {
            const harvestHeader = document.createElement('li');
            harvestHeader.style.cssText = `
                padding: 15px 10px 5px 10px;
                font-weight: bold;
                font-size: 16px;
                color: #FF9800;
                background: rgba(255, 152, 0, 0.1);
                border-radius: 8px;
                margin-bottom: 5px;
                margin-top: 15px;
            `;
            harvestHeader.innerHTML = '🌾 Урожай';
            warehouseList.appendChild(harvestHeader);

            harvestedItems.forEach(crop => {
                const plant = PLANT_DATA[crop];
                const maxCount = gameState.warehouse[crop];

                const li = document.createElement('li');
                li.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;
                `;

                li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 28px;">${crop}</span>
                        <div>
                            <div style="font-weight: bold;">${plant.name}</div>
                            <div style="font-size: 12px; color: #666;">
                                ${maxCount} шт. • ${plant.sellPrice.toFixed(2)} за шт.
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="minus-btn" data-crop="${crop}" style="width: 32px; height: 32px; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;">−</button>
                        <span class="sell-count" data-crop="${crop}" style="min-width: 30px; text-align: center; font-weight: bold; font-size: 16px;">1</span>
                        <button class="plus-btn" data-crop="${crop}" style="width: 32px; height: 32px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;">+</button>
                        <button class="sell-btn" data-crop="${crop}" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 8px;">Продать</button>
                    </div>
                `;

                warehouseList.appendChild(li);
            });
        }

        // ✅ СЕКЦИЯ 3: Гибриды (внизу списка)
        const hybridItems = Object.keys(gameState.warehouse).filter(key => {
            return gameState.warehouse[key] > 0 && !PLANT_DATA[key]; // Только гибриды
        });
        
        if (hybridItems.length > 0) {
            const hybridsHeader = document.createElement('li');
            hybridsHeader.style.cssText = `
                padding: 15px 10px 5px 10px;
                font-weight: bold;
                font-size: 16px;
                color: #9C27B0;
                background: rgba(156, 39, 176, 0.1);
                border-radius: 8px;
                margin-bottom: 5px;
                margin-top: 15px;
            `;
            hybridsHeader.innerHTML = '🧬 Гибриды';
            warehouseList.appendChild(hybridsHeader);

            hybridItems.forEach(crop => {
                const hybrid = getHybridData(crop, gameState);
                const sellPrice = hybrid ? hybrid.sellPrice : 0;
                const name = getHybridName(crop, gameState);
                const maxCount = gameState.warehouse[crop];

                const li = document.createElement('li');
                li.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;
                `;

                li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 28px;">${crop}</span>
                        <div>
                            <div style="font-weight: bold;">${name}</div>
                            <div style="font-size: 12px; color: #666;">
                                ${maxCount} шт. • ${sellPrice.toFixed(2)} за шт.
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="minus-btn" data-crop="${crop}" style="width: 32px; height: 32px; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;">−</button>
                        <span class="sell-count" data-crop="${crop}" style="min-width: 30px; text-align: center; font-weight: bold; font-size: 16px;">1</span>
                        <button class="plus-btn" data-crop="${crop}" style="width: 32px; height: 32px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 20px; font-weight: bold; line-height: 1;">+</button>
                        <button class="sell-btn" data-crop="${crop}" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 8px;">Продать</button>
                    </div>
                `;

                warehouseList.appendChild(li);
            });
        }

        // Проверка на пустой склад
        if (seedsInInventory.length === 0 && harvestedItems.length === 0 && hybridItems.length === 0) {
            warehouseList.innerHTML = '<li style="text-align: center; color: #999;">Склад пуст</li>';
            sellAllButton.style.display = 'none';
            return;
        }

        // Кнопка "Продать всё" показывается только если есть урожай или гибриды
        sellAllButton.style.display = (harvestedItems.length > 0 || hybridItems.length > 0) ? 'block' : 'none';

        // Обработчики для кнопок продажи
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const crop = btn.dataset.crop;
                const countEl = document.querySelector(`.sell-count[data-crop="${crop}"]`);
                let count = parseInt(countEl.textContent);
                if (count > 1) countEl.textContent = count - 1;
            });
        });

        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const crop = btn.dataset.crop;
                const maxCount = gameState.warehouse[crop];
                const countEl = document.querySelector(`.sell-count[data-crop="${crop}"]`);
                let count = parseInt(countEl.textContent);
                if (count < maxCount) countEl.textContent = count + 1;
            });
        });

        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const crop = btn.dataset.crop;
                const countEl = document.querySelector(`.sell-count[data-crop="${crop}"]`);
                const sellCount = parseInt(countEl.textContent);
                const plant = PLANT_DATA[crop];
                const hybrid = getHybridData(crop, gameState);
                const sellPrice = plant ? plant.sellPrice : (hybrid ? hybrid.sellPrice : 0);
                
                gameState.balance += sellPrice * sellCount;
                gameState.warehouse[crop] -= sellCount;
                
                if (gameState.warehouse[crop] <= 0) {
                    delete gameState.warehouse[crop];
                }
                
                updateBalanceDisplay();
                updateWarehouseDisplay();
                saveGameData();
                hapticFeedback('success');
            });
        });
    }





// ✅ ИСПРАВЛЕНИЕ: Вызываем updateGardenBeds() ПОСЛЕ инициализации
// setTimeout(() => updateGardenBeds(), 100);    

// ✅ ИСПРАВЛЕНИЕ: Вызываем loadGameData с callback
loadGameData(initializeGame);

if (isAdmin) {
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.style.display = 'block';
        resetButton.addEventListener('click', () => {
            if (confirm('Админ-сброс: удалить весь прогресс?')) {
                localStorage.removeItem('farmGame');
                if (tg.CloudStorage && typeof tg.CloudStorage.removeItem === 'function') {
                    tg.CloudStorage.removeItem('farmGame');
                }
                location.reload();
            }
        });
    }
}
});
