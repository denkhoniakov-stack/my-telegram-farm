// ========================================
// СИСТЕМА ГИБРИДИЗАЦИИ РАСТЕНИЙ
// ========================================

// База данных всех возможных гибридов (105 комбинаций)
const HYBRID_RECIPES = {
    // Морковь (15 комбинаций)
    '🥕-🍅': { result: '🍕', name: 'Пицца-Морковь', rarity: 'epic' },
    '🥕-🍆': { result: '🫑', name: 'Баклажкорка', rarity: 'epic' },
    '🥕-🌽': { result: '🌮', name: 'Тако-Корнет', rarity: 'epic' },
    '🥕-🥒': { result: '🥗', name: 'Хрустяшка', rarity: 'epic' },
    '🥕-🍓': { result: '🍰', name: 'Морковный Торт', rarity: 'epic' },
    '🥕-🥔': { result: '🍟', name: 'Золотая Картошка', rarity: 'epic' },
    '🥕-🌶️': { result: '🫚', name: 'Огненный Корень', rarity: 'epic' },
    '🥕-🥬': { result: '🥙', name: 'Зеленый Рулет', rarity: 'epic' },
    '🥕-🧅': { result: '🍲', name: 'Суповар', rarity: 'epic' },
    '🥕-🥦': { result: '🥘', name: 'Бро-Морковь', rarity: 'epic' },
    '🥕-🍉': { result: '🍹', name: 'Арбузный Фреш', rarity: 'epic' },
    '🥕-🍇': { result: '🍸', name: 'Виноморковь', rarity: 'epic' },
    '🥕-🍑': { result: '🥧', name: 'Персико-Пай', rarity: 'epic' },
    '🥕-🍊': { result: '🧃', name: 'Цитрокорка', rarity: 'epic' },
    '🥕-🥭': { result: '🍨', name: 'Манго-Морозко', rarity: 'epic' },
    
    // Томат (14 комбинаций)
    '🍅-🍆': { result: '🍝', name: 'Паста-Маркет', rarity: 'epic' },
    '🍅-🌽': { result: '🌯', name: 'Томато-Буррито', rarity: 'epic' },
    '🍅-🥒': { result: '🥪', name: 'Клаб-Сэндвич', rarity: 'epic' },
    '🍅-🍓': { result: '🍓', name: 'Красный Коктейль', rarity: 'epic' },
    '🍅-🥔': { result: '🍔', name: 'Томато-Бургер', rarity: 'epic' },
    '🍅-🌶️': { result: '🌭', name: 'Острый Дог', rarity: 'epic' },
    '🍅-🥬': { result: '🥗', name: 'Салат Цезарь', rarity: 'epic' },
    '🍅-🧅': { result: '🍛', name: 'Томатное Карри', rarity: 'epic' },
    '🍅-🥦': { result: '🥘', name: 'Овощное Рагу', rarity: 'epic' },
    '🍅-🍉': { result: '🧃', name: 'Томатный Сок', rarity: 'epic' },
    '🍅-🍇': { result: '🍷', name: 'Томатное Вино', rarity: 'epic' },
    '🍅-🍑': { result: '🧁', name: 'Персико-Маффин', rarity: 'epic' },
    '🍅-🍊': { result: '🍹', name: 'Цитрусовый Микс', rarity: 'epic' },
    '🍅-🥭': { result: '🍨', name: 'Тропический Десерт', rarity: 'epic' },
    
    // Баклажан (13 комбинаций)
    '🍆-🌽': { result: '🥙', name: 'Баклажанная Шаурма', rarity: 'epic' },
    '🍆-🥒': { result: '🍱', name: 'Овощной Бокс', rarity: 'epic' },
    '🍆-🍓': { result: '🍰', name: 'Фиолетовый Торт', rarity: 'epic' },
    '🍆-🥔': { result: '🍟', name: 'Баклажанные Чипсы', rarity: 'epic' },
    '🍆-🌶️': { result: '🌶️', name: 'Острый Баклажан', rarity: 'epic' },
    '🍆-🥬': { result: '🥗', name: 'Зеленый Баклажан', rarity: 'epic' },
    '🍆-🧅': { result: '🍲', name: 'Луковое Соте', rarity: 'epic' },
    '🍆-🥦': { result: '🥘', name: 'Брокколажан', rarity: 'epic' },
    '🍆-🍉': { result: '🧃', name: 'Фиолетовый Сок', rarity: 'epic' },
    '🍆-🍇': { result: '🍸', name: 'Виноклажан', rarity: 'epic' },
    '🍆-🍑': { result: '🥧', name: 'Баклажанный Пирог', rarity: 'epic' },
    '🍆-🍊': { result: '🧁', name: 'Цитроклажан', rarity: 'epic' },
    '🍆-🥭': { result: '🍨', name: 'Манго-Баклажан', rarity: 'epic' },
    
    // Кукуруза (12 комбинаций)
    '🌽-🥒': { result: '🌮', name: 'Огурузная Тако', rarity: 'epic' },
    '🌽-🍓': { result: '🍿', name: 'Ягодный Попкорн', rarity: 'epic' },
    '🌽-🥔': { result: '🍟', name: 'Кукурузные Палочки', rarity: 'epic' },
    '🌽-🌶️': { result: '🌭', name: 'Острая Кукуруза', rarity: 'epic' },
    '🌽-🥬': { result: '🥗', name: 'Салат с Кукурузой', rarity: 'epic' },
    '🌽-🧅': { result: '🍲', name: 'Кукурузный Суп', rarity: 'epic' },
    '🌽-🥦': { result: '🥘', name: 'Зеленая Кукуруза', rarity: 'epic' },
    '🌽-🍉': { result: '🧃', name: 'Кукурузный Нектар', rarity: 'epic' },
    '🌽-🍇': { result: '🍸', name: 'Виноруза', rarity: 'epic' },
    '🌽-🍑': { result: '🥧', name: 'Персико-Кукуруза', rarity: 'epic' },
    '🌽-🍊': { result: '🧁', name: 'Цитроруза', rarity: 'epic' },
    '🌽-🥭': { result: '🍨', name: 'Манго-Кукуруза', rarity: 'epic' },
    
    // Огурец (11 комбинаций)
    '🥒-🍓': { result: '🍹', name: 'Освежающий Смузи', rarity: 'epic' },
    '🥒-🥔': { result: '🥗', name: 'Картофельный Салат', rarity: 'epic' },
    '🥒-🌶️': { result: '🥙', name: 'Острый Огурец', rarity: 'epic' },
    '🥒-🥬': { result: '🥗', name: 'Зеленый Хруст', rarity: 'epic' },
    '🥒-🧅': { result: '🍲', name: 'Огуречный Суп', rarity: 'epic' },
    '🥒-🥦': { result: '🥘', name: 'Брокколец', rarity: 'epic' },
    '🥒-🍉': { result: '🧃', name: 'Арбузец', rarity: 'epic' },
    '🥒-🍇': { result: '🍸', name: 'Виногурец', rarity: 'epic' },
    '🥒-🍑': { result: '🥧', name: 'Персогурец', rarity: 'epic' },
    '🥒-🍊': { result: '🧁', name: 'Цитрогурец', rarity: 'epic' },
    '🥒-🥭': { result: '🍨', name: 'Манго-Огурец', rarity: 'epic' },
    
    // Клубника (10 комбинаций)
    '🍓-🥔': { result: '🍰', name: 'Клубничный Десерт', rarity: 'epic' },
    '🍓-🌶️': { result: '🍹', name: 'Острая Ягода', rarity: 'epic' },
    '🍓-🥬': { result: '🥗', name: 'Ягодный Салат', rarity: 'epic' },
    '🍓-🧅': { result: '🍲', name: 'Ягодное Ассорти', rarity: 'epic' },
    '🍓-🥦': { result: '🥘', name: 'Зеленая Клубника', rarity: 'epic' },
    '🍓-🍉': { result: '🧃', name: 'Арбузная Ягода', rarity: 'epic' },
    '🍓-🍇': { result: '🍸', name: 'Виноклубника', rarity: 'epic' },
    '🍓-🍑': { result: '🥧', name: 'Персико-Ягода', rarity: 'epic' },
    '🍓-🍊': { result: '🧁', name: 'Цитро-Ягода', rarity: 'epic' },
    '🍓-🥭': { result: '🍨', name: 'Манго-Клубника', rarity: 'epic' },
    
    // Картофель (9 комбинаций)
    '🥔-🌶️': { result: '🍟', name: 'Острая Картошка', rarity: 'epic' },
    '🥔-🥬': { result: '🥗', name: 'Картофельный Микс', rarity: 'epic' },
    '🥔-🧅': { result: '🍲', name: 'Луковая Картошка', rarity: 'epic' },
    '🥔-🥦': { result: '🥘', name: 'Бро-Картошка', rarity: 'epic' },
    '🥔-🍉': { result: '🧃', name: 'Арбузный Картофель', rarity: 'epic' },
    '🥔-🍇': { result: '🍸', name: 'Виноградель', rarity: 'epic' },
    '🥔-🍑': { result: '🥧', name: 'Персико-Картошка', rarity: 'epic' },
    '🥔-🍊': { result: '🧁', name: 'Цитро-Картофель', rarity: 'epic' },
    '🥔-🥭': { result: '🍨', name: 'Манго-Картофель', rarity: 'epic' },
    
    // Перец (8 комбинаций)
    '🌶️-🥬': { result: '🥗', name: 'Острый Салат', rarity: 'epic' },
    '🌶️-🧅': { result: '🍲', name: 'Перцовый Суп', rarity: 'epic' },
    '🌶️-🥦': { result: '🥘', name: 'Острая Брокколи', rarity: 'epic' },
    '🌶️-🍉': { result: '🧃', name: 'Острый Арбуз', rarity: 'epic' },
    '🌶️-🍇': { result: '🍸', name: 'Винный Перец', rarity: 'epic' },
    '🌶️-🍑': { result: '🥧', name: 'Острый Персик', rarity: 'epic' },
    '🌶️-🍊': { result: '🧁', name: 'Острый Цитрус', rarity: 'epic' },
    '🌶️-🥭': { result: '🍨', name: 'Острое Манго', rarity: 'epic' },
    
    // Салат (7 комбинаций)
    '🥬-🧅': { result: '🍲', name: 'Луковый Салат', rarity: 'epic' },
    '🥬-🥦': { result: '🥘', name: 'Супер-Салат', rarity: 'epic' },
    '🥬-🍉': { result: '🧃', name: 'Арбузный Салат', rarity: 'epic' },
    '🥬-🍇': { result: '🍸', name: 'Винный Салат', rarity: 'epic' },
    '🥬-🍑': { result: '🥧', name: 'Персиковый Салат', rarity: 'epic' },
    '🥬-🍊': { result: '🧁', name: 'Цитрусовый Салат', rarity: 'epic' },
    '🥬-🥭': { result: '🍨', name: 'Манго-Салат', rarity: 'epic' },
    
    // Лук (6 комбинаций)
    '🧅-🥦': { result: '🥘', name: 'Луковая Брокколи', rarity: 'epic' },
    '🧅-🍉': { result: '🧃', name: 'Луковый Арбуз', rarity: 'epic' },
    '🧅-🍇': { result: '🍸', name: 'Виноградный Лук', rarity: 'epic' },
    '🧅-🍑': { result: '🥧', name: 'Луковый Персик', rarity: 'epic' },
    '🧅-🍊': { result: '🧁', name: 'Луковый Цитрус', rarity: 'epic' },
    '🧅-🥭': { result: '🍨', name: 'Луковое Манго', rarity: 'epic' },
    
    // Брокколи (5 комбинаций)
    '🥦-🍉': { result: '🧃', name: 'Брокколи-Арбуз', rarity: 'epic' },
    '🥦-🍇': { result: '🍸', name: 'Виноколи', rarity: 'epic' },
    '🥦-🍑': { result: '🥧', name: 'Персиколи', rarity: 'epic' },
    '🥦-🍊': { result: '🧁', name: 'Цитроколи', rarity: 'epic' },
    '🥦-🥭': { result: '🍨', name: 'Манго-Брокколи', rarity: 'epic' },
    
    // Арбуз (4 комбинации)
    '🍉-🍇': { result: '🍸', name: 'Виноарбуз', rarity: 'epic' },
    '🍉-🍑': { result: '🥧', name: 'Персиарбуз', rarity: 'epic' },
    '🍉-🍊': { result: '🧁', name: 'Цитроарбуз', rarity: 'epic' },
    '🍉-🥭': { result: '🍨', name: 'Манго-Арбуз', rarity: 'epic' },
    
    // Виноград (3 комбинации)
    '🍇-🍑': { result: '🥧', name: 'Персиноград', rarity: 'epic' },
    '🍇-🍊': { result: '🧁', name: 'Цитроград', rarity: 'epic' },
    '🍇-🥭': { result: '🍨', name: 'Манго-Виноград', rarity: 'epic' },
    
    // Персик (2 комбинации)
    '🍑-🍊': { result: '🧁', name: 'Цитроперсик', rarity: 'epic' },
    '🍑-🥭': { result: '🍨', name: 'Манго-Персик', rarity: 'epic' },
    
    // Апельсин (1 комбинация)
    '🍊-🥭': { result: '🍨', name: 'Апельсиново-Манго', rarity: 'epic' }
};


const HYBRID_RECIPES_FULL = {};
for (const [key, value] of Object.entries(HYBRID_RECIPES)) {
    HYBRID_RECIPES_FULL[key] = value;
    const [seed1, seed2] = key.split('-');
    HYBRID_RECIPES_FULL[`${seed2}-${seed1}`] = value;
}

const HYBRID_DATA = {
    '🍕': { growTime: 0, sellPrice: 0 }, '🫑': { growTime: 0, sellPrice: 0 }, '🌮': { growTime: 0, sellPrice: 0 }, '🥗': { growTime: 0, sellPrice: 0 }, '🍰': { growTime: 0, sellPrice: 0 }, '🍟': { growTime: 0, sellPrice: 0 }, '🫚': { growTime: 0, sellPrice: 0 }, '🥙': { growTime: 0, sellPrice: 0 }, '🍲': { growTime: 0, sellPrice: 0 }, '🥘': { growTime: 0, sellPrice: 0 }, '🍹': { growTime: 0, sellPrice: 0 }, '🍸': { growTime: 0, sellPrice: 0 }, '🥧': { growTime: 0, sellPrice: 0 }, '🧃': { growTime: 0, sellPrice: 0 }, '🍨': { growTime: 0, sellPrice: 0 }, '🍝': { growTime: 0, sellPrice: 0 }, '🌯': { growTime: 0, sellPrice: 0 }, '🥪': { growTime: 0, sellPrice: 0 }, '🍔': { growTime: 0, sellPrice: 0 }, '🌭': { growTime: 0, sellPrice: 0 }, '🍛': { growTime: 0, sellPrice: 0 }, '🍷': { growTime: 0, sellPrice: 0 }, '🧁': { growTime: 0, sellPrice: 0 }, '🍱': { growTime: 0, sellPrice: 0 }, '🌶️': { growTime: 0, sellPrice: 0 }, '🍿': { growTime: 0, sellPrice: 0 }, '🍓': { growTime: 0, sellPrice: 0 }
};

function getHybridData(hybridEmoji, gameState) {
    if (gameState && gameState.hybridData && gameState.hybridData[hybridEmoji]) {
        return gameState.hybridData[hybridEmoji];
    }
    return HYBRID_DATA[hybridEmoji] || null;
}

function getHybridName(hybridEmoji, gameState) {
    if (gameState && gameState.hybridData && gameState.hybridData[hybridEmoji]) {
        return gameState.hybridData[hybridEmoji].name;
    }
    for (const value of Object.values(HYBRID_RECIPES_FULL)) {
        if (value.result === hybridEmoji) return value.name;
    }
    return 'Гибрид';
}

function getHybridRecipe(seed1, seed2) {
    if (seed1 === seed2) return null;
    return HYBRID_RECIPES_FULL[`${seed1}-${seed2}`] || null;
}

function calculateHybridStats(crop1, crop2, PLANT_DATA, gameState) {
    const parent1 = PLANT_DATA[crop1] || getHybridData(crop1, gameState);
    const parent2 = PLANT_DATA[crop2] || getHybridData(crop2, gameState);
    if (!parent1 || !parent2) return { growTime: 30, sellPrice: 50, mixCost: 50 };
    const avgGrowTime = parent1.growTime + parent2.growTime;
    const hybridTime = Math.floor(avgGrowTime / 1000);
    const hybridPrice = (parent1.sellPrice + parent2.sellPrice) * 1.5;
    const mixCost = Math.max(10, Math.floor(hybridPrice * 0.1));
    return { growTime: hybridTime, sellPrice: parseFloat(hybridPrice.toFixed(2)), mixCost: mixCost };
}

// ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Глобальная переменная для отслеживания инициализации
let labUIInitialized = false;
let crop1Global = null;
let crop2Global = null;
let mixingTimerInterval = null; 

function initHybridLab(gameState, tg, updateBalanceDisplay, saveGameData, PLANT_DATA) {
    const labContainer = document.getElementById('inventory-tab');
    if (!labContainer) return;

    // ✅ Инициализация данных
    if (gameState.hybridMixing === undefined) gameState.hybridMixing = null;
    if (!gameState.hybridData) gameState.hybridData = {};

    // ✅ Отрисовываем HTML только один раз
    if (!labUIInitialized) {
        labUIInitialized = true;
        
        labContainer.innerHTML = `
            <div class="lab-container">
                <div class="lab-header-new">
                    <div class="lab-icon">🧪</div>
                    <h3>Лаборатория Гибридов</h3>
                    <p>Выберите два овоща для создания уникального гибрида</p>
                </div>
                
                <!-- ✅ НОВОЕ: Вкладки для отображения открытых гибридов -->
                <div class="hybrid-tabs">
                    <button class="hybrid-tab active" data-rarity="epic">
                        <span class="tab-icon">💜</span>
                        <span class="tab-label">Эпические</span>
                    </button>
                    <button class="hybrid-tab" data-rarity="legendary">
                        <span class="tab-icon">✨</span>
                        <span class="tab-label">Легендарные</span>
                    </button>
                    <button class="hybrid-tab" data-rarity="mythic">
                        <span class="tab-icon">🔥</span>
                        <span class="tab-label">Мифические</span>
                    </button>
                </div>
                
                <!-- ✅ НОВОЕ: Список открытых гибридов -->
                <div class="discovered-hybrids-list" id="discoveredHybridsList"></div>
                
                <div class="lab-divider"></div>
                
                <div class="lab-selection">
                    <div id="slot1" class="lab-slot-new"><span class="slot-placeholder">?</span></div>
                    <div class="lab-plus-new">+</div>
                    <div id="slot2" class="lab-slot-new"><span class="slot-placeholder">?</span></div>
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

        const slot1El = document.getElementById('slot1');
        const slot2El = document.getElementById('slot2');
        const mixBtn = document.getElementById('mixBtn');
        const msgEl = document.getElementById('msg');
        const cropModal = document.getElementById('cropModal');
        const cropModalList = document.getElementById('cropModalList');
        const cropModalClose = document.querySelector('.crop-modal-close');
        let activeSlot = null;

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
                        crop1Global = crop;
                        slot1El.innerHTML = `<span class="slot-emoji">${crop}</span>`;
                        slot1El.classList.add('filled');
                    } else {
                        crop2Global = crop;
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
        cropModal.onclick = (e) => { 
            if (e.target === cropModal) cropModal.classList.add('hidden'); 
        };
        
        slot1El.onclick = () => {
            if (gameState.hybridMixing) return;
            
            if (crop1Global) {
                crop1Global = null;
                slot1El.innerHTML = '<span class="slot-placeholder">?</span>';
                slot1El.classList.remove('filled');
            } else {
                openCropModal(1);
            }
        };
        
        slot2El.onclick = () => {
            if (gameState.hybridMixing) return;
            
            if (crop2Global) {
                crop2Global = null;
                slot2El.innerHTML = '<span class="slot-placeholder">?</span>';
                slot2El.classList.remove('filled');
            } else {
                openCropModal(2);
            }
        };

        mixBtn.onclick = () => {
            if (!crop1Global || !crop2Global) { 
                msgEl.innerHTML = '<div class="result-error">❌ Выберите два овоща!</div>'; 
                return; 
            }
            if (crop1Global === crop2Global) { 
                msgEl.innerHTML = '<div class="result-warning">⚠️ Одинаковые овощи!</div>'; 
                return; 
            }
            const recipe = getHybridRecipe(crop1Global, crop2Global);
            if (!recipe) { 
                msgEl.innerHTML = '<div class="result-warning">🔬 Комбинация не работает!</div>'; 
                return; 
            }
            const stats = calculateHybridStats(crop1Global, crop2Global, PLANT_DATA, gameState);
            
            // ✅ ДОБАВЛЕНО: Сохраняем редкость вместе с данными гибрида
            gameState.hybridData[recipe.result] = { 
                growTime: stats.growTime * 1000, 
                sellPrice: stats.sellPrice, 
                name: recipe.name,
                rarity: recipe.rarity
            };
            
            gameState.warehouse[crop1Global]--;
            gameState.warehouse[crop2Global]--;
            
            // ✅ ДОБАВЛЕНО: Удаляем записи с нулевым количеством
            if (gameState.warehouse[crop1Global] <= 0) {
                delete gameState.warehouse[crop1Global];
            }
            if (gameState.warehouse[crop2Global] <= 0) {
                delete gameState.warehouse[crop2Global];
            }
            
            gameState.hybridMixing = { 
                startTime: Date.now(), 
                duration: stats.growTime * 1000, 
                resultEmoji: recipe.result, 
                resultName: recipe.name, 
                crop1: crop1Global, 
                crop2: crop2Global 
            };
            
            updateBalanceDisplay();
            saveGameData();
            
            mixBtn.disabled = true;
            mixBtn.style.opacity = '0.5';
            slot1El.style.pointerEvents = 'none';
            slot2El.style.pointerEvents = 'none';
            
            startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        };

        // ✅ НОВОЕ: Обработчики для вкладок
        const hybridTabs = document.querySelectorAll('.hybrid-tab');
        hybridTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                hybridTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateDiscoveredHybridsList(tab.dataset.rarity, gameState);
            });
        });
        
        // ✅ НОВОЕ: Инициализируем список открытых гибридов
        updateDiscoveredHybridsList('epic', gameState);
    }

    // ✅ ИСПРАВЛЕНИЕ: Восстанавливаем UI при каждом заходе в лабораторию
    const slot1El = document.getElementById('slot1');
    const slot2El = document.getElementById('slot2');
    const mixBtn = document.getElementById('mixBtn');
    const msgEl = document.getElementById('msg');

    if (gameState.hybridMixing) {
        crop1Global = gameState.hybridMixing.crop1;
        crop2Global = gameState.hybridMixing.crop2;
        slot1El.innerHTML = `<span class="slot-emoji">${crop1Global}</span>`;
        slot1El.classList.add('filled');
        slot2El.innerHTML = `<span class="slot-emoji">${crop2Global}</span>`;
        slot2El.classList.add('filled');
        mixBtn.disabled = true;
        mixBtn.style.opacity = '0.5';
        slot1El.style.pointerEvents = 'none';
        slot2El.style.pointerEvents = 'none';
        startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
    } else {
        crop1Global = null;
        crop2Global = null;
        slot1El.innerHTML = '<span class="slot-placeholder">?</span>';
        slot1El.classList.remove('filled');
        slot2El.innerHTML = '<span class="slot-placeholder">?</span>';
        slot2El.classList.remove('filled');
        mixBtn.disabled = false;
        mixBtn.style.opacity = '1';
        slot1El.style.pointerEvents = 'all';
        slot2El.style.pointerEvents = 'all';
        msgEl.innerHTML = '';
    }
    
    // ✅ НОВОЕ: Обновляем список открытых гибридов при каждом заходе
    const activeTab = document.querySelector('.hybrid-tab.active');
    if (activeTab) {
        updateDiscoveredHybridsList(activeTab.dataset.rarity, gameState);
    }
}


function startMixingTimer(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixing;
    if (!mixing) return;
    
    // ✅ ДОБАВЛЕНО: Очищаем предыдущий таймер, если он существует
    if (mixingTimerInterval) {
        clearInterval(mixingTimerInterval);
        mixingTimerInterval = null;
    }
    
    const elapsed = Date.now() - mixing.startTime;
    let remainingTime = Math.max(0, Math.floor((mixing.duration - elapsed) / 1000));
    
    if (remainingTime === 0) {
        showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        return;
    }
    
    msgEl.innerHTML = `<div class="simple-timer" id="hybridTimer">${remainingTime}</div>`;
    const timerEl = document.getElementById('hybridTimer');
    
    // ✅ ИСПРАВЛЕНИЕ: Сохраняем ID таймера в глобальную переменную
    mixingTimerInterval = setInterval(() => {
        remainingTime--;
        if (timerEl) {
            timerEl.textContent = remainingTime;
        }
        if (remainingTime <= 0) {
            clearInterval(mixingTimerInterval);
            mixingTimerInterval = null; // ✅ ДОБАВЛЕНО: очищаем переменную
            
            if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
                tg.HapticFeedback.notificationOccurred('success');
            }
            showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        }
    }, 1000);
}


function showClaimButton(gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixing;
    
    // ✅ ДОБАВЛЕНО: Очищаем таймер при показе кнопки сбора
    if (mixingTimerInterval) {
        clearInterval(mixingTimerInterval);
        mixingTimerInterval = null;
    }
    
    msgEl.innerHTML = `<button id="claimBtn" class="claim-hybrid-btn">${mixing.resultEmoji} ${mixing.resultName}</button>`;
    const claimBtn = document.getElementById('claimBtn');
    
    claimBtn.onclick = () => {
        gameState.warehouse[mixing.resultEmoji] = (gameState.warehouse[mixing.resultEmoji] || 0) + 1;
        gameState.hybridMixing = null;
        saveGameData();
        
        mixBtn.disabled = false;
        mixBtn.style.opacity = '1';
        slot1El.style.pointerEvents = 'all';
        slot2El.style.pointerEvents = 'all';
        slot1El.innerHTML = '<span class="slot-placeholder">?</span>';
        slot1El.classList.remove('filled');
        slot2El.innerHTML = '<span class="slot-placeholder">?</span>';
        slot2El.classList.remove('filled');
        msgEl.innerHTML = '';
        crop1Global = null;
        crop2Global = null;
    };
}

function updateDiscoveredHybridsList(rarity, gameState) {
    const listEl = document.getElementById('discoveredHybridsList');
    if (!listEl) return;
    
    // Получаем все открытые гибриды с нужной редкостью
    const discoveredHybrids = [];
    
    for (const [key, recipe] of Object.entries(HYBRID_RECIPES_FULL)) {
        if (recipe.rarity === rarity && gameState.hybridData[recipe.result]) {
            discoveredHybrids.push({
                emoji: recipe.result,
                name: recipe.name,
                data: gameState.hybridData[recipe.result]
            });
        }
    }
    
    if (discoveredHybrids.length === 0) {
        listEl.innerHTML = `<div class="no-hybrids">Пока нет открытых ${getRarityName(rarity)} гибридов</div>`;
        return;
    }
    
    listEl.innerHTML = discoveredHybrids.map(hybrid => `
        <div class="discovered-hybrid-item ${rarity}">
            <div class="hybrid-emoji">${hybrid.emoji}</div>
            <div class="hybrid-info">
                <div class="hybrid-name">${hybrid.name}</div>
                <div class="hybrid-stats">
                    ⏱️ ${Math.floor(hybrid.data.growTime / 1000)}с • 
                    💰 ${hybrid.data.sellPrice.toFixed(2)}
                </div>
            </div>
        </div>
    `).join('');
}

function getRarityName(rarity) {
    const names = {
        'epic': 'эпических',
        'legendary': 'легендарных',
        'mythic': 'мифических'
    };
    return names[rarity] || '';
}
