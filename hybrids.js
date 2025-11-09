
// ========================================
// СИСТЕМА ГИБРИДИЗАЦИИ РАСТЕНИЙ
// ========================================

// База данных всех возможных гибридов (105 комбинаций)
const HYBRID_RECIPES = {
    // === МОРКОВЬ (🥕) === 14 комбинаций
    '🥕-🍅': { result: '🍕', name: 'Пицца-Морковь' },
    '🥕-🍆': { result: '🫑', name: 'Баклажкорка' },
    '🥕-🌽': { result: '🌮', name: 'Тако-Корнет' },
    '🥕-🥒': { result: '🥗', name: 'Хрустяшка' },
    '🥕-🍓': { result: '🍰', name: 'Морковный Торт' },
    '🥕-🥔': { result: '🍟', name: 'Золотая Картошка' },
    '🥕-🌶️': { result: '🫚', name: 'Огненный Корень' },
    '🥕-🥬': { result: '🥙', name: 'Зеленый Рулет' },
    '🥕-🧅': { result: '🍲', name: 'Суповар' },
    '🥕-🥦': { result: '🥘', name: 'Бро-Морковь' },
    '🥕-🍉': { result: '🍹', name: 'Арбузный Фреш' },
    '🥕-🍇': { result: '🍸', name: 'Виноморковь' },
    '🥕-🍑': { result: '🥧', name: 'Персико-Пай' },
    '🥕-🍊': { result: '🧃', name: 'Цитрокорка' },
    '🥕-🥭': { result: '🍨', name: 'Манго-Морозко' },
    // === ПОМИДОР (🍅) === 13 комбинаций
    '🍅-🍆': { result: '🍝', name: 'Паста-Маркет' },
    '🍅-🌽': { result: '🌯', name: 'Томато-Буррито' },
    '🍅-🥒': { result: '🥪', name: 'Клаб-Сэндвич' },
    '🍅-🍓': { result: '🍓', name: 'Красный Коктейль' },
    '🍅-🥔': { result: '🍔', name: 'Томато-Бургер' },
    '🍅-🌶️': { result: '🌭', name: 'Острый Дог' },
    '🍅-🥬': { result: '🥗', name: 'Салат Цезарь' },
    '🍅-🧅': { result: '🍛', name: 'Томатное Карри' },
    '🍅-🥦': { result: '🥘', name: 'Овощное Рагу' },
    '🍅-🍉': { result: '🧃', name: 'Томатный Сок' },
    '🍅-🍇': { result: '🍷', name: 'Томатное Вино' },
    '🍅-🍑': { result: '🧁', name: 'Персико-Маффин' },
    '🍅-🍊': { result: '🍹', name: 'Цитрусовый Микс' },
    '🍅-🥭': { result: '🍨', name: 'Тропический Десерт' },
    // === БАКЛАЖАН (🍆) === 12 комбинаций
    '🍆-🌽': { result: '🥙', name: 'Баклажанная Шаурма' },
    '🍆-🥒': { result: '🍱', name: 'Овощной Бокс' },
    '🍆-🍓': { result: '🍰', name: 'Фиолетовый Торт' },
    '🍆-🥔': { result: '🍟', name: 'Баклажанные Чипсы' },
    '🍆-🌶️': { result: '🌶️', name: 'Острый Баклажан' },
    '🍆-🥬': { result: '🥗', name: 'Зеленый Баклажан' },
    '🍆-🧅': { result: '🍲', name: 'Луковое Соте' },
    '🍆-🥦': { result: '🥘', name: 'Брокколажан' },
    '🍆-🍉': { result: '🧃', name: 'Фиолетовый Сок' },
    '🍆-🍇': { result: '🍸', name: 'Виноклажан' },
    '🍆-🍑': { result: '🥧', name: 'Баклажанный Пирог' },
    '🍆-🍊': { result: '🧁', name: 'Цитроклажан' },
    '🍆-🥭': { result: '🍨', name: 'Манго-Баклажан' },
    // === КУКУРУЗА (🌽) === 11 комбинаций
    '🌽-🥒': { result: '🌮', name: 'Огурузная Тако' },
    '🌽-🍓': { result: '🍿', name: 'Ягодный Попкорн' },
    '🌽-🥔': { result: '🍟', name: 'Кукурузные Палочки' },
    '🌽-🌶️': { result: '🌭', name: 'Острая Кукуруза' },
    '🌽-🥬': { result: '🥗', name: 'Салат с Кукурузой' },
    '🌽-🧅': { result: '🍲', name: 'Кукурузный Суп' },
    '🌽-🥦': { result: '🥘', name: 'Зеленая Кукуруза' },
    '🌽-🍉': { result: '🧃', name: 'Кукурузный Нектар' },
    '🌽-🍇': { result: '🍸', name: 'Виноруза' },
    '🌽-🍑': { result: '🥧', name: 'Персико-Кукуруза' },
    '🌽-🍊': { result: '🧁', name: 'Цитроруза' },
    '🌽-🥭': { result: '🍨', name: 'Манго-Кукуруза' },
    // === ОГУРЕЦ (🥒) === 10 комбинаций
    '🥒-🍓': { result: '🍹', name: 'Освежающий Смузи' },
    '🥒-🥔': { result: '🥗', name: 'Картофельный Салат' },
    '🥒-🌶️': { result: '🥙', name: 'Острый Огурец' },
    '🥒-🥬': { result: '🥗', name: 'Зеленый Хруст' },
    '🥒-🧅': { result: '🍲', name: 'Огуречный Суп' },
    '🥒-🥦': { result: '🥘', name: 'Брокколец' },
    '🥒-🍉': { result: '🧃', name: 'Арбузец' },
    '🥒-🍇': { result: '🍸', name: 'Виногурец' },
    '🥒-🍑': { result: '🥧', name: 'Персогурец' },
    '🥒-🍊': { result: '🧁', name: 'Цитрогурец' },
    '🥒-🥭': { result: '🍨', name: 'Манго-Огурец' },
    // === КЛУБНИКА (🍓) === 9 комбинаций
    '🍓-🥔': { result: '🍰', name: 'Клубничный Десерт' },
    '🍓-🌶️': { result: '🍹', name: 'Острая Ягода' },
    '🍓-🥬': { result: '🥗', name: 'Ягодный Салат' },
    '🍓-🧅': { result: '🍲', name: 'Ягодное Ассорти' },
    '🍓-🥦': { result: '🥘', name: 'Зеленая Клубника' },
    '🍓-🍉': { result: '🧃', name: 'Арбузная Ягода' },
    '🍓-🍇': { result: '🍸', name: 'Виноклубника' },
    '🍓-🍑': { result: '🥧', name: 'Персико-Ягода' },
    '🍓-🍊': { result: '🧁', name: 'Цитро-Ягода' },
    '🍓-🥭': { result: '🍨', name: 'Манго-Клубника' },
    // === КАРТОФЕЛЬ (🥔) === 8 комбинаций
    '🥔-🌶️': { result: '🍟', name: 'Острая Картошка' },
    '🥔-🥬': { result: '🥗', name: 'Картофельный Микс' },
    '🥔-🧅': { result: '🍲', name: 'Луковая Картошка' },
    '🥔-🥦': { result: '🥘', name: 'Бро-Картошка' },
    '🥔-🍉': { result: '🧃', name: 'Арбузный Картофель' },
    '🥔-🍇': { result: '🍸', name: 'Виноградель' },
    '🥔-🍑': { result: '🥧', name: 'Персико-Картошка' },
    '🥔-🍊': { result: '🧁', name: 'Цитро-Картофель' },
    '🥔-🥭': { result: '🍨', name: 'Манго-Картофель' },
    // === ПЕРЕЦ (🌶️) === 7 комбинаций
    '🌶️-🥬': { result: '🥗', name: 'Острый Салат' },
    '🌶️-🧅': { result: '🍲', name: 'Перцовый Суп' },
    '🌶️-🥦': { result: '🥘', name: 'Острая Брокколи' },
    '🌶️-🍉': { result: '🧃', name: 'Острый Арбуз' },
    '🌶️-🍇': { result: '🍸', name: 'Винный Перец' },
    '🌶️-🍑': { result: '🥧', name: 'Острый Персик' },
    '🌶️-🍊': { result: '🧁', name: 'Острый Цитрус' },
    '🌶️-🥭': { result: '🍨', name: 'Острое Манго' },
    // === САЛАТ (🥬) === 6 комбинаций
    '🥬-🧅': { result: '🍲', name: 'Луковый Салат' },
    '🥬-🥦': { result: '🥘', name: 'Супер-Салат' },
    '🥬-🍉': { result: '🧃', name: 'Арбузный Салат' },
    '🥬-🍇': { result: '🍸', name: 'Винный Салат' },
    '🥬-🍑': { result: '🥧', name: 'Персиковый Салат' },
    '🥬-🍊': { result: '🧁', name: 'Цитрусовый Салат' },
    '🥬-🥭': { result: '🍨', name: 'Манго-Салат' },
    // === ЛУК (🧅) === 5 комбинаций
    '🧅-🥦': { result: '🥘', name: 'Луковая Брокколи' },
    '🧅-🍉': { result: '🧃', name: 'Луковый Арбуз' },
    '🧅-🍇': { result: '🍸', name: 'Виноградный Лук' },
    '🧅-🍑': { result: '🥧', name: 'Луковый Персик' },
    '🧅-🍊': { result: '🧁', name: 'Луковый Цитрус' },
    '🧅-🥭': { result: '🍨', name: 'Луковое Манго' },
    // === БРОККОЛИ (🥦) === 4 комбинации
    '🥦-🍉': { result: '🧃', name: 'Брокколи-Арбуз' },
    '🥦-🍇': { result: '🍸', name: 'Виноколи' },
    '🥦-🍑': { result: '🥧', name: 'Персиколи' },
    '🥦-🍊': { result: '🧁', name: 'Цитроколи' },
    '🥦-🥭': { result: '🍨', name: 'Манго-Брокколи' },
    // === АРБУЗ (🍉) === 3 комбинации
    '🍉-🍇': { result: '🍸', name: 'Виноарбуз' },
    '🍉-🍑': { result: '🥧', name: 'Персиарбуз' },
    '🍉-🍊': { result: '🧁', name: 'Цитроарбуз' },
    '🍉-🥭': { result: '🍨', name: 'Манго-Арбуз' },
    // === ВИНОГРАД (🍇) === 2 комбинации
    '🍇-🍑': { result: '🥧', name: 'Персиноград' },
    '🍇-🍊': { result: '🧁', name: 'Цитроград' },
    '🍇-🥭': { result: '🍨', name: 'Манго-Виноград' },
    // === ПЕРСИК (🍑) === 1 комбинация
    '🍑-🍊': { result: '🧁', name: 'Цитроперсик' },
    '🍑-🥭': { result: '🍨', name: 'Манго-Персик' },
    // === АПЕЛЬСИН (🍊) === последняя
    '🍊-🥭': { result: '🍨', name: 'Апельсиново-Манго' }
};

// Создаем обратные комбинации
const HYBRID_RECIPES_FULL = {};
for (const [key, value] of Object.entries(HYBRID_RECIPES)) {
    HYBRID_RECIPES_FULL[key] = value;
    const [seed1, seed2] = key.split('-');
    const reverseKey = `${seed2}-${seed1}`;
    HYBRID_RECIPES_FULL[reverseKey] = value;
}

// База данных характеристик гибридов ПО УМОЛЧАНИЮ
const HYBRID_DATA = {
    '🍕': { growTime: 0, sellPrice: 0 }, '🫑': { growTime: 0, sellPrice: 0 },
    '🌮': { growTime: 0, sellPrice: 0 }, '🥗': { growTime: 0, sellPrice: 0 },
    '🍰': { growTime: 0, sellPrice: 0 }, '🍟': { growTime: 0, sellPrice: 0 },
    '🫚': { growTime: 0, sellPrice: 0 }, '🥙': { growTime: 0, sellPrice: 0 },
    '🍲': { growTime: 0, sellPrice: 0 }, '🥘': { growTime: 0, sellPrice: 0 },
    '🍹': { growTime: 0, sellPrice: 0 }, '🍸': { growTime: 0, sellPrice: 0 },
    '🥧': { growTime: 0, sellPrice: 0 }, '🧃': { growTime: 0, sellPrice: 0 },
    '🍨': { growTime: 0, sellPrice: 0 }, '🍝': { growTime: 0, sellPrice: 0 },
    '🌯': { growTime: 0, sellPrice: 0 }, '🥪': { growTime: 0, sellPrice: 0 },
    '🍔': { growTime: 0, sellPrice: 0 }, '🌭': { growTime: 0, sellPrice: 0 },
    '🍛': { growTime: 0, sellPrice: 0 }, '🍷': { growTime: 0, sellPrice: 0 },
    '🧁': { growTime: 0, sellPrice: 0 }, '🍱': { growTime: 0, sellPrice: 0 },
    '🌶️': { growTime: 0, sellPrice: 0 }, '🍿': { growTime: 0, sellPrice: 0 },
    '🍓': { growTime: 0, sellPrice: 0 }
};

// ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Получает данные гибрида из gameState
function getHybridData(hybridEmoji, gameState) {
    if (gameState && gameState.hybridData && gameState.hybridData[hybridEmoji]) {
        return gameState.hybridData[hybridEmoji];
    }
    return HYBRID_DATA[hybridEmoji] || null;
}

// ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Получает имя гибрида из gameState
function getHybridName(hybridEmoji, gameState) {
    if (gameState && gameState.hybridData && gameState.hybridData[hybridEmoji]) {
        return gameState.hybridData[hybridEmoji].name;
    }
    // Если в сохранении нет, ищем в рецептах
    for (const value of Object.values(HYBRID_RECIPES_FULL)) {
        if (value.result === hybridEmoji) {
            return value.name;
        }
    }
    return 'Гибрид';
}

function getHybridRecipe(seed1, seed2) {
    if (seed1 === seed2) return null;
    const key = `${seed1}-${seed2}`;
    return HYBRID_RECIPES_FULL[key] || null;
}

// ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Рассчитывает статистику, используя данные из gameState
function calculateHybridStats(crop1, crop2, PLANT_DATA, gameState) {
    const parent1 = PLANT_DATA[crop1] || getHybridData(crop1, gameState);
    const parent2 = PLANT_DATA[crop2] || getHybridData(crop2, gameState);

    if (!parent1 || !parent2) {
        return { growTime: 30, sellPrice: 50, mixCost: 50 };
    }

    const avgGrowTime = parent1.growTime + parent2.growTime;
    const hybridTime = Math.floor(avgGrowTime / 1000);
    const hybridPrice = (parent1.sellPrice + parent2.sellPrice) * 1.5;
    const mixCost = Math.max(10, Math.floor(hybridPrice * 0.1));

    return {
        growTime: hybridTime,
        sellPrice: parseFloat(hybridPrice.toFixed(2)),
        mixCost: mixCost
    };
}

// ========================================
// UI ЛАБОРАТОРИИ
// ========================================
function initHybridLab(gameState, tg, updateBalanceDisplay, saveGameData, PLANT_DATA) {
    const labContainer = document.getElementById('inventory-tab');
    if (!labContainer) return;

    // ✅ ИСПРАВЛЕНИЕ: Гарантируем, что объекты в gameState существуют
    if (!gameState.hybridMixing) {
        gameState.hybridMixing = null;
    }
    if (!gameState.hybridData) {
        gameState.hybridData = {};
    }

    labContainer.innerHTML = `
        <div class="lab-container">
            <div class="lab-header-new">
                <div class="lab-icon">🧪</div>
                <h3>Лаборатория Гибридов</h3>
                <p>Выберите два овоща для создания уникального гибрида</p>
            </div>
            <div class="lab-selection">
                <div id="slot1" class="lab-slot-new">
                    <span class="slot-placeholder">?</span>
                </div>
                <div class="lab-plus-new">+</div>
                <div id="slot2" class="lab-slot-new">
                    <span class="slot-placeholder">?</span>
                </div>
            </div>
            <button id="mixBtn" class="lab-mix-btn">✨ Скрестить</button>
            <div id="msg" class="lab-result-message"></div>
        </div>
        <div id="cropModal" class="crop-modal hidden">
            <div class="crop-modal-content">
                <div class="crop-modal-header">
                    <h3>Выберите овощ</h3>
                    <button class="crop-modal-close">&times;</button>
                </div>
                <ul id="cropModalList" class="crop-modal-list"></ul>
            </div>
        </div>
    `;

    let crop1 = null, crop2 = null, activeSlot = null;

    const slot1El = document.getElementById('slot1');
    const slot2El = document.getElementById('slot2');
    const mixBtn = document.getElementById('mixBtn');
    const msgEl = document.getElementById('msg');
    const cropModal = document.getElementById('cropModal');
    const cropModalList = document.getElementById('cropModalList');
    const cropModalClose = document.querySelector('.crop-modal-close');

    function openCropModal(slotNumber) {
        activeSlot = slotNumber;
        const crops = Object.keys(gameState.warehouse).filter(k => gameState.warehouse[k] > 0);

        if (crops.length === 0) {
            tg.showAlert('На складе нет овощей!');
            return;
        }

        cropModalList.innerHTML = '';
        crops.forEach(crop => {
            const plant = PLANT_DATA[crop];
            // ✅ ИСПРАВЛЕНИЕ: Передаем gameState для получения данных гибрида
            const hybrid = getHybridData(crop, gameState);
            if (!plant && !hybrid) return;

            const li = document.createElement('li');
            li.className = 'crop-modal-item';
            li.innerHTML = `
                <div class="crop-modal-icon">${crop}</div>
                <div class="crop-modal-details">
                    <div class="crop-modal-name">${plant ? plant.name : getHybridName(crop, gameState)}</div>
                    <div class="crop-modal-count">${gameState.warehouse[crop]} шт</div>
                </div>
            `;
            li.onclick = () => {
                if (activeSlot === 1) {
                    crop1 = crop;
                    slot1El.innerHTML = `<span class="slot-emoji">${crop}</span>`;
                    slot1El.classList.add('filled');
                } else {
                    crop2 = crop;
                    slot2El.innerHTML = `<span class="slot-emoji">${crop}</span>`;
                    slot2El.classList.add('filled');
                }
                cropModal.classList.add('hidden');
            };
            cropModalList.appendChild(li);
        });

        cropModal.classList.remove('hidden');
    }

    cropModalClose.onclick = () => cropModal.classList.add('hidden');
    cropModal.onclick = (e) => { if (e.target === cropModal) cropModal.classList.add('hidden'); };

    slot1El.onclick = () => {
        if (crop1) {
            crop1 = null;
            slot1El.innerHTML = '<span class="slot-placeholder">?</span>';
            slot1El.classList.remove('filled');
        } else openCropModal(1);
    };

    slot2El.onclick = () => {
        if (crop2) {
            crop2 = null;
            slot2El.innerHTML = '<span class="slot-placeholder">?</span>';
            slot2El.classList.remove('filled');
        } else openCropModal(2);
    };

    // ✅ ИСПРАВЛЕННЫЙ обработчик скрещивания
    mixBtn.onclick = () => {
        if (!crop1 || !crop2) {
            msgEl.innerHTML = '<div class="result-error">❌ Выберите два овоща!</div>';
            return;
        }
        if (crop1 === crop2) {
            msgEl.innerHTML = '<div class="result-warning">⚠️ Одинаковые овощи!</div>';
            return;
        }

        const recipe = getHybridRecipe(crop1, crop2);
        if (!recipe) {
            msgEl.innerHTML = '<div class="result-warning">🔬 Комбинация не работает!</div>';
            return;
        }

        const stats = calculateHybridStats(crop1, crop2, PLANT_DATA, gameState);
        const hybridTime = stats.growTime;

        // 🔥 ГЛАВНОЕ: Сохраняем данные в gameState
        gameState.hybridData[recipe.result] = {
            growTime: stats.growTime * 1000,
            sellPrice: stats.sellPrice,
            name: recipe.name
        };

        gameState.warehouse[crop1]--;
        gameState.warehouse[crop2]--;
        
        gameState.hybridMixing = {
            startTime: Date.now(),
            duration: hybridTime * 1000,
            resultEmoji: recipe.result,
            resultName: recipe.name,
            crop1: crop1,
            crop2: crop2
        };
        
        updateBalanceDisplay();
        saveGameData(); // Сохраняем все изменения

        mixBtn.disabled = true;
        mixBtn.style.opacity = '0.5';
        slot1El.style.pointerEvents = 'none';
        slot2El.style.pointerEvents = 'none';

        startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
    };

    // Проверка активного скрещивания при загрузке
    if (gameState.hybridMixing) {
        crop1 = gameState.hybridMixing.crop1;
        crop2 = gameState.hybridMixing.crop2;
        
        if (crop1) {
            slot1El.innerHTML = `<span class="slot-emoji">${crop1}</span>`;
            slot1El.classList.add('filled');
        }
        if (crop2) {
            slot2El.innerHTML = `<span class="slot-emoji">${crop2}</span>`;
            slot2El.classList.add('filled');
        }
        
        mixBtn.disabled = true;
        mixBtn.style.opacity = '0.5';
        slot1El.style.pointerEvents = 'none';
        slot2El.style.pointerEvents = 'none';
        startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
    }
}

// ========================================
// ФУНКЦИИ ВОССТАНОВЛЕНИЯ ТАЙМЕРА
// ========================================
function startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixing;
    if (!mixing) return;

    const elapsed = Date.now() - mixing.startTime;
    let remainingTime = Math.max(0, Math.floor((mixing.duration - elapsed) / 1000));

    if (remainingTime === 0) {
        showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        return;
    }

    msgEl.innerHTML = `<div class="simple-timer" id="hybridTimer">${remainingTime}с</div>`;
    const timerEl = document.getElementById('hybridTimer');

    const timerInterval = setInterval(() => {
        remainingTime--;
        if (timerEl) {
            timerEl.textContent = `${remainingTime}с`;
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
                tg.HapticFeedback.notificationOccurred('success');
            }
            showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        }
    }, 1000);
}

function showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixing;
    if (!mixing) return;

    // ✅ ИСПРАВЛЕНИЕ: Получаем актуальное имя гибрида
    const resultName = getHybridName(mixing.resultEmoji, gameState);
    
    msgEl.innerHTML = `<button id="claimBtn" class="claim-hybrid-btn">${mixing.resultEmoji} Получить ${resultName}</button>`;

    const claimBtn = document.getElementById('claimBtn');
    claimBtn.onclick = () => {
        gameState.warehouse[mixing.resultEmoji] = (gameState.warehouse[mixing.resultEmoji] || 0) + 1;
        gameState.hybridMixing = null;
        saveGameData();

        // Обновляем весь UI лаборатории, чтобы сбросить состояние
        initHybridLab(gameState, tg, window.updateBalanceDisplay, saveGameData, window.PLANT_DATA);
    };
}

