// ========================================
// СИСТЕМА ГИБРИДИЗАЦИИ РАСТЕНИЙ
// ========================================

// База данных всех возможных гибридов (105 комбинаций)
const HYBRID_RECIPES = {
    // Морковь (15 комбинаций)
    '🥕-🍅': { result: '🍕', name: 'Морковицца', rarity: 'epic' },
    '🥕-🍆': { result: '🫑', name: 'Каклажор', rarity: 'epic' },
    '🥕-🌽': { result: '🌮', name: 'Моркуруза', rarity: 'epic' },
    '🥕-🥒': { result: '🥗', name: 'Огуровка', rarity: 'epic' },
    '🥕-🍓': { result: '🍰', name: 'Морковника', rarity: 'epic' },
    '🥕-🥔': { result: '🍟', name: 'Каркошка', rarity: 'epic' },
    '🥕-🌶️': { result: '🫚', name: 'Перковь', rarity: 'epic' },
    '🥕-🥬': { result: '🥙', name: 'Салаковка', rarity: 'epic' },
    '🥕-🧅': { result: '🍲', name: 'Луковка', rarity: 'epic' },
    '🥕-🥦': { result: '🥘', name: 'Брокковь', rarity: 'epic' },
    '🥕-🍉': { result: '🍹', name: 'Морбузка', rarity: 'epic' },
    '🥕-🍇': { result: '🍸', name: 'Винковь', rarity: 'epic' },
    '🥕-🍑': { result: '🥧', name: 'Персковь', rarity: 'epic' },
    '🥕-🍊': { result: '🧃', name: 'Апелковь', rarity: 'epic' },
    '🥕-🥭': { result: '🍨', name: 'Манковка', rarity: 'epic' },
    
    // Томат (14 комбинаций)
    '🍅-🍆': { result: '🍝', name: 'Томклажан', rarity: 'epic' },
    '🍅-🌽': { result: '🌯', name: 'Кукумат', rarity: 'epic' },
    '🍅-🥒': { result: '🥪', name: 'Огурмат', rarity: 'epic' },
    '🍅-🍓': { result: '🍓', name: 'Клубмат', rarity: 'epic' },
    '🍅-🥔': { result: '🍔', name: 'Картомат', rarity: 'epic' },
    '🍅-🌶️': { result: '🌭', name: 'Перцомат', rarity: 'epic' },
    '🍅-🥬': { result: '🥗', name: 'Салатомат', rarity: 'epic' },
    '🍅-🧅': { result: '🍛', name: 'Лукомат', rarity: 'epic' },
    '🍅-🥦': { result: '🥘', name: 'Броккомат', rarity: 'epic' },
    '🍅-🍉': { result: '🧃', name: 'Арбумат', rarity: 'epic' },
    '🍅-🍇': { result: '🍷', name: 'Виномат', rarity: 'epic' },
    '🍅-🍑': { result: '🧁', name: 'Персомат', rarity: 'epic' },
    '🍅-🍊': { result: '🍹', name: 'Апельсомат', rarity: 'epic' },
    '🍅-🥭': { result: '🍨', name: 'Мангомат', rarity: 'epic' },
    
    // Баклажан (13 комбинаций)
    '🍆-🌽': { result: '🥙', name: 'Баккуруза', rarity: 'epic' },
    '🍆-🥒': { result: '🍱', name: 'Огурклажан', rarity: 'epic' },
    '🍆-🍓': { result: '🍰', name: 'Клубклажан', rarity: 'epic' },
    '🍆-🥔': { result: '🍟', name: 'Картоклажан', rarity: 'epic' },
    '🍆-🌶️': { result: '🌶️', name: 'Перклажан', rarity: 'epic' },
    '🍆-🥬': { result: '🥗', name: 'Салаклажан', rarity: 'epic' },
    '🍆-🧅': { result: '🍲', name: 'Луклажан', rarity: 'epic' },
    '🍆-🥦': { result: '🥘', name: 'Брокклажан', rarity: 'epic' },
    '🍆-🍉': { result: '🧃', name: 'Арбуклажан', rarity: 'epic' },
    '🍆-🍇': { result: '🍸', name: 'Виноклажан', rarity: 'epic' },
    '🍆-🍑': { result: '🥧', name: 'Персклажан', rarity: 'epic' },
    '🍆-🍊': { result: '🧁', name: 'Апельклажан', rarity: 'epic' },
    '🍆-🥭': { result: '🍨', name: 'Мангоклажан', rarity: 'epic' },
    
    // Кукуруза (12 комбинаций)
    '🌽-🥒': { result: '🌮', name: 'Огурукуруза', rarity: 'epic' },
    '🌽-🍓': { result: '🍿', name: 'Клубкуруза', rarity: 'epic' },
    '🌽-🥔': { result: '🍟', name: 'Картокуруза', rarity: 'epic' },
    '🌽-🌶️': { result: '🌭', name: 'Перкуруза', rarity: 'epic' },
    '🌽-🥬': { result: '🥗', name: 'Салакуруза', rarity: 'epic' },
    '🌽-🧅': { result: '🍲', name: 'Лукуруза', rarity: 'epic' },
    '🌽-🥦': { result: '🥘', name: 'Броккуруза', rarity: 'epic' },
    '🌽-🍉': { result: '🧃', name: 'Арбукуруза', rarity: 'epic' },
    '🌽-🍇': { result: '🍸', name: 'Винокуруза', rarity: 'epic' },
    '🌽-🍑': { result: '🥧', name: 'Перскуруза', rarity: 'epic' },
    '🌽-🍊': { result: '🧁', name: 'Апелькуруза', rarity: 'epic' },
    '🌽-🥭': { result: '🍨', name: 'Мангокуруза', rarity: 'epic' },
    
    // Огурец (11 комбинаций)
    '🥒-🍓': { result: '🍹', name: 'Клубгурец', rarity: 'epic' },
    '🥒-🥔': { result: '🥗', name: 'Картогурец', rarity: 'epic' },
    '🥒-🌶️': { result: '🥙', name: 'Перогурец', rarity: 'epic' },
    '🥒-🥬': { result: '🥗', name: 'Салагурец', rarity: 'epic' },
    '🥒-🧅': { result: '🍲', name: 'Лукогурец', rarity: 'epic' },
    '🥒-🥦': { result: '🥘', name: 'Броккогурец', rarity: 'epic' },
    '🥒-🍉': { result: '🧃', name: 'Арбугурец', rarity: 'epic' },
    '🥒-🍇': { result: '🍸', name: 'Виногурец', rarity: 'epic' },
    '🥒-🍑': { result: '🥧', name: 'Персогурец', rarity: 'epic' },
    '🥒-🍊': { result: '🧁', name: 'Апельгурец', rarity: 'epic' },
    '🥒-🥭': { result: '🍨', name: 'Мангогурец', rarity: 'epic' },
    
    // Клубника (10 комбинаций)
    '🍓-🥔': { result: '🍰', name: 'Картовника', rarity: 'epic' },
    '🍓-🌶️': { result: '🍹', name: 'Перовника', rarity: 'epic' },
    '🍓-🥬': { result: '🥗', name: 'Салавника', rarity: 'epic' },
    '🍓-🧅': { result: '🍲', name: 'Луковника', rarity: 'epic' },
    '🍓-🥦': { result: '🥘', name: 'Брокковника', rarity: 'epic' },
    '🍓-🍉': { result: '🧃', name: 'Арбувника', rarity: 'epic' },
    '🍓-🍇': { result: '🍸', name: 'Виновника', rarity: 'epic' },
    '🍓-🍑': { result: '🥧', name: 'Персовника', rarity: 'epic' },
    '🍓-🍊': { result: '🧁', name: 'Апельвника', rarity: 'epic' },
    '🍓-🥭': { result: '🍨', name: 'Мангобника', rarity: 'epic' },
    
    // Картофель (9 комбинаций)
    '🥔-🌶️': { result: '🍟', name: 'Перкошка', rarity: 'epic' },
    '🥔-🥬': { result: '🥗', name: 'Салакошка', rarity: 'epic' },
    '🥔-🧅': { result: '🍲', name: 'Лукошка', rarity: 'epic' },
    '🥔-🥦': { result: '🥘', name: 'Броккошка', rarity: 'epic' },
    '🥔-🍉': { result: '🧃', name: 'Арбукошка', rarity: 'epic' },
    '🥔-🍇': { result: '🍸', name: 'Винокошка', rarity: 'epic' },
    '🥔-🍑': { result: '🥧', name: 'Перскошка', rarity: 'epic' },
    '🥔-🍊': { result: '🧁', name: 'Апелькошка', rarity: 'epic' },
    '🥔-🥭': { result: '🍨', name: 'Мангокошка', rarity: 'epic' },
    
    // Перец (8 комбинаций)
    '🌶️-🥬': { result: '🥗', name: 'Салаперец', rarity: 'epic' },
    '🌶️-🧅': { result: '🍲', name: 'Лукоперец', rarity: 'epic' },
    '🌶️-🥦': { result: '🥘', name: 'Броккоперец', rarity: 'epic' },
    '🌶️-🍉': { result: '🧃', name: 'Арбуперец', rarity: 'epic' },
    '🌶️-🍇': { result: '🍸', name: 'Виноперец', rarity: 'epic' },
    '🌶️-🍑': { result: '🥧', name: 'Персоперец', rarity: 'epic' },
    '🌶️-🍊': { result: '🧁', name: 'Апельперец', rarity: 'epic' },
    '🌶️-🥭': { result: '🍨', name: 'Мангоперец', rarity: 'epic' },
    
    // Салат (7 комбинаций)
    '🥬-🧅': { result: '🍲', name: 'Лукалат', rarity: 'epic' },
    '🥬-🥦': { result: '🥘', name: 'Броккалат', rarity: 'epic' },
    '🥬-🍉': { result: '🧃', name: 'Арбулат', rarity: 'epic' },
    '🥬-🍇': { result: '🍸', name: 'Винолат', rarity: 'epic' },
    '🥬-🍑': { result: '🥧', name: 'Персалат', rarity: 'epic' },
    '🥬-🍊': { result: '🧁', name: 'Апельсалат', rarity: 'epic' },
    '🥬-🥭': { result: '🍨', name: 'Мангалат', rarity: 'epic' },
    
    // Лук (6 комбинаций)
    '🧅-🥦': { result: '🥘', name: 'Брокколук', rarity: 'epic' },
    '🧅-🍉': { result: '🧃', name: 'Арбулук', rarity: 'epic' },
    '🧅-🍇': { result: '🍸', name: 'Винолук', rarity: 'epic' },
    '🧅-🍑': { result: '🥧', name: 'Персолук', rarity: 'epic' },
    '🧅-🍊': { result: '🧁', name: 'Апельсолук', rarity: 'epic' },
    '🧅-🥭': { result: '🍨', name: 'Манголук', rarity: 'epic' },
    
    // Брокколи (5 комбинаций)
    '🥦-🍉': { result: '🧃', name: 'Арбуколи', rarity: 'epic' },
    '🥦-🍇': { result: '🍸', name: 'Виноколи', rarity: 'epic' },
    '🥦-🍑': { result: '🥧', name: 'Персоколи', rarity: 'epic' },
    '🥦-🍊': { result: '🧁', name: 'Апельколи', rarity: 'epic' },
    '🥦-🥭': { result: '🍨', name: 'Мангоколи', rarity: 'epic' },
    
    // Арбуз (4 комбинации)
    '🍉-🍇': { result: '🍸', name: 'Винобуз', rarity: 'epic' },
    '🍉-🍑': { result: '🥧', name: 'Персобуз', rarity: 'epic' },
    '🍉-🍊': { result: '🧁', name: 'Апельбуз', rarity: 'epic' },
    '🍉-🥭': { result: '🍨', name: 'Мангобуз', rarity: 'epic' },
    
    // Виноград (3 комбинации)
    '🍇-🍑': { result: '🥧', name: 'Персоград', rarity: 'epic' },
    '🍇-🍊': { result: '🧁', name: 'Апельград', rarity: 'epic' },
    '🍇-🥭': { result: '🍨', name: 'Мангоград', rarity: 'epic' },
    
    // Персик (2 комбинации)
    '🍑-🍊': { result: '🧁', name: 'Апельсик', rarity: 'epic' },
    '🍑-🥭': { result: '🍨', name: 'Мангосик', rarity: 'epic' },
    
    // Апельсин (1 комбинация)
    '🍊-🥭': { result: '🍨', name: 'Мангосин', rarity: 'epic' }
};

// ✅ НОВАЯ ФУНКЦИЯ: Создание легендарного гибрида из двух эпических
function createLegendaryHybrid(epic1, epic2, gameState) {
    const hybrid1Data = gameState.hybridData[epic1];
    const hybrid2Data = gameState.hybridData[epic2];
    
    if (!hybrid1Data || !hybrid2Data) return null;
    if (hybrid1Data.rarity !== 'epic' || hybrid2Data.rarity !== 'epic') return null;
    
    const name1 = hybrid1Data.name;
    const name2 = hybrid2Data.name;
    
    const halfIndex1 = Math.ceil(name1.length / 2);
    const halfIndex2 = Math.floor(name2.length / 2);
    const legendaryName = name1.slice(0, halfIndex1) + name2.slice(halfIndex2);
    
    const legendaryEmojis = ['⭐', '💎', '👑', '🏆', '🔱', '🎖️', '🌟', '✨', '💫', '🎯', '🏅', '🔰'];
    const randomEmoji = legendaryEmojis[Math.floor(Math.random() * legendaryEmojis.length)];
    
    // ✅ Время в миллисекундах, переводим в секунды, суммируем
    const growTime1 = hybrid1Data.growTime / 1000;
    const growTime2 = hybrid2Data.growTime / 1000;
    const growTime = Math.floor(growTime1 + growTime2);
    
    // ✅ Цена = СУММА × 1.5
    const sellPrice = Math.floor((hybrid1Data.sellPrice + hybrid2Data.sellPrice) * 1.5);
    
    return {
        result: randomEmoji,
        name: legendaryName,
        rarity: 'legendary',
        growTime: growTime, // В секундах
        sellPrice: sellPrice
    };
}



// ✅ НОВАЯ ФУНКЦИЯ: Создание мифического гибрида из двух легендарных
function createMythicHybrid(legendary1, legendary2, gameState) {
    const hybrid1Data = gameState.hybridData[legendary1];
    const hybrid2Data = gameState.hybridData[legendary2];
    
    if (!hybrid1Data || !hybrid2Data) return null;
    if (hybrid1Data.rarity !== 'legendary' || hybrid2Data.rarity !== 'legendary') return null;
    
    const name1 = hybrid1Data.name;
    const name2 = hybrid2Data.name;
    
    const halfIndex1 = Math.ceil(name1.length / 2);
    const halfIndex2 = Math.floor(name2.length / 2);
    const mythicName = name1.slice(0, halfIndex1) + name2.slice(halfIndex2);
    
    const mythicEmojis = ['🔥', '⚡', '🌈', '💀', '🦄', '🐉', '👹', '🎃', '🔮', '🗡️', '🛡️', '⚔️'];
    const randomEmoji = mythicEmojis[Math.floor(Math.random() * mythicEmojis.length)];
    
    // ✅ Время в миллисекундах, переводим в секунды, суммируем
    const growTime1 = hybrid1Data.growTime / 1000;
    const growTime2 = hybrid2Data.growTime / 1000;
    const growTime = Math.floor(growTime1 + growTime2);
    
    // ✅ Цена = СУММА × 1.7
    const sellPrice = Math.floor((hybrid1Data.sellPrice + hybrid2Data.sellPrice) * 1.7);
    
    return {
        result: randomEmoji,
        name: mythicName,
        rarity: 'mythic',
        growTime: growTime, // В секундах
        sellPrice: sellPrice
    };
}




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
    const plant1 = PLANT_DATA[crop1] || getHybridData(crop1, gameState);
    const plant2 = PLANT_DATA[crop2] || getHybridData(crop2, gameState);
    
    // Получаем время в секундах
    let growTime1 = plant1.growTime;
    let growTime2 = plant2.growTime;
    
    // Если это гибрид, время уже в миллисекундах - переводим в секунды
    if (!PLANT_DATA[crop1] && gameState.hybridData[crop1]) {
        growTime1 = growTime1 / 1000;
    }
    if (!PLANT_DATA[crop2] && gameState.hybridData[crop2]) {
        growTime2 = growTime2 / 1000;
    }
    
    // ✅ Время = сумма в секундах
    const growTime = growTime1 + growTime2;
    
    // ✅ Цена = СУММА × 1.3
    const sellPrice = (plant1.sellPrice + plant2.sellPrice) * 1.3;
    
    return { growTime, sellPrice }; // Возвращаем в секундах
}




let labUIInitialized = false;
let cropSelections = {
    epic: { crop1: null, crop2: null },
    legendary: { crop1: null, crop2: null },
    mythic: { crop1: null, crop2: null }
};
let mixingTimerIntervals = {
    epic: null,
    legendary: null,
    mythic: null
};

function initHybridLab(gameState, tg, updateBalanceDisplay, saveGameData, PLANT_DATA) {
    const labContainer = document.getElementById('inventory-tab');
    if (!labContainer) return;

    // ✅ Инициализация данных для параллельных процессов
    if (!gameState.hybridMixings) {
        gameState.hybridMixings = {
            epic: null,
            legendary: null,
            mythic: null
        };
    }
    if (!gameState.hybridData) gameState.hybridData = {};

    // ✅ Отрисовываем HTML только один раз
    if (!labUIInitialized) {
        labUIInitialized = true;
        
        labContainer.innerHTML = `
            <div class="lab-container">
                <div class="hybrid-tabs">
                    <button class="hybrid-tab active" data-rarity="epic">Эпические</button>
                    <button class="hybrid-tab" data-rarity="legendary">Легендарные</button>
                    <button class="hybrid-tab" data-rarity="mythic">Мифические</button>
                </div>
                
                <div class="lab-header-new">
                    <div class="lab-icon">🧪</div>
                    <h3>Лаборатория Гибридов</h3>
                    <p>Выберите два овоща для создания уникального гибрида</p>
                </div>
                
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

        // ✅ Функция получения активной редкости
        function getActiveRarity() {
            const activeTab = document.querySelector('.hybrid-tab.active');
            return activeTab ? activeTab.dataset.rarity : 'epic';
        }

        function openCropModal(slotNumber) {
            activeSlot = slotNumber;
            const activeRarity = getActiveRarity();
            
            let crops = Object.keys(gameState.warehouse).filter(k => gameState.warehouse[k] > 0);
            
            if (activeRarity === 'epic') {
                crops = crops.filter(crop => PLANT_DATA[crop]);
            } else if (activeRarity === 'legendary') {
                crops = crops.filter(crop => {
                    if (PLANT_DATA[crop]) return false;
                    const hybridData = gameState.hybridData[crop];
                    return hybridData && hybridData.rarity === 'epic';
                });
            } else if (activeRarity === 'mythic') {
                crops = crops.filter(crop => {
                    if (PLANT_DATA[crop]) return false;
                    const hybridData = gameState.hybridData[crop];
                    return hybridData && hybridData.rarity === 'legendary';
                });
            }
            
            if (crops.length === 0) { 
                tg.showAlert('На складе нет подходящих овощей для этой категории!'); 
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
                    const activeRarity = getActiveRarity();
                    if (activeSlot === 1) {
                        cropSelections[activeRarity].crop1 = crop;
                        slot1El.innerHTML = `<span class="slot-emoji">${crop}</span>`;
                        slot1El.classList.add('filled');
                    } else {
                        cropSelections[activeRarity].crop2 = crop;
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
            const activeRarity = getActiveRarity();
            if (gameState.hybridMixings[activeRarity]) return;
            
            if (cropSelections[activeRarity].crop1) {
                cropSelections[activeRarity].crop1 = null;
                slot1El.innerHTML = '<span class="slot-placeholder">?</span>';
                slot1El.classList.remove('filled');
            } else {
                openCropModal(1);
            }
        };
        
        slot2El.onclick = () => {
            const activeRarity = getActiveRarity();
            if (gameState.hybridMixings[activeRarity]) return;
            
            if (cropSelections[activeRarity].crop2) {
                cropSelections[activeRarity].crop2 = null;
                slot2El.innerHTML = '<span class="slot-placeholder">?</span>';
                slot2El.classList.remove('filled');
            } else {
                openCropModal(2);
            }
        };

        mixBtn.onclick = () => {
            const activeRarity = getActiveRarity();
            const crop1 = cropSelections[activeRarity].crop1;
            const crop2 = cropSelections[activeRarity].crop2;
            
            if (!crop1 || !crop2) { 
                msgEl.innerHTML = '<div class="result-error">❌ Выберите два овоща!</div>'; 
                return; 
            }
            if (crop1 === crop2) { 
                msgEl.innerHTML = '<div class="result-warning">⚠️ Одинаковые овощи!</div>'; 
                return; 
            }
            
            let recipe = null;
            let stats = null;
            
            if (activeRarity === 'epic') {
                recipe = getHybridRecipe(crop1, crop2);
                if (!recipe) { 
                    msgEl.innerHTML = '<div class="result-warning">🔬 Комбинация не работает!</div>'; 
                    return; 
                }
                stats = calculateHybridStats(crop1, crop2, PLANT_DATA, gameState);
                stats.name = recipe.name;
                stats.resultEmoji = recipe.result;
                stats.rarity = 'epic';
            } else if (activeRarity === 'legendary') {
                recipe = createLegendaryHybrid(crop1, crop2, gameState);
                if (!recipe) { 
                    msgEl.innerHTML = '<div class="result-warning">⚠️ Нужны два эпических гибрида!</div>'; 
                    return; 
                }
                stats = {
                    growTime: recipe.growTime,
                    sellPrice: recipe.sellPrice,
                    name: recipe.name,
                    resultEmoji: recipe.result,
                    rarity: 'legendary'
                };
            } else if (activeRarity === 'mythic') {
                recipe = createMythicHybrid(crop1, crop2, gameState);
                if (!recipe) { 
                    msgEl.innerHTML = '<div class="result-warning">⚠️ Нужны два легендарных гибрида!</div>'; 
                    return; 
                }
                stats = {
                    growTime: recipe.growTime,
                    sellPrice: recipe.sellPrice,
                    name: recipe.name,
                    resultEmoji: recipe.result,
                    rarity: 'mythic'
                };
            }
            
            gameState.hybridData[stats.resultEmoji] = { 
                growTime: stats.growTime * 1000, 
                sellPrice: stats.sellPrice, 
                name: stats.name,
                rarity: stats.rarity
            };
            
            gameState.warehouse[crop1]--;
            gameState.warehouse[crop2]--;
            
            if (gameState.warehouse[crop1] <= 0) delete gameState.warehouse[crop1];
            if (gameState.warehouse[crop2] <= 0) delete gameState.warehouse[crop2];
            
            gameState.hybridMixings[activeRarity] = { 
                startTime: Date.now(), 
                duration: stats.growTime * 1000, 
                resultEmoji: stats.resultEmoji, 
                resultName: stats.name, 
                crop1: crop1, 
                crop2: crop2 
            };
            
            updateBalanceDisplay();
            saveGameData();
            
            mixBtn.disabled = true;
            mixBtn.style.opacity = '0.5';
            slot1El.style.pointerEvents = 'none';
            slot2El.style.pointerEvents = 'none';
            
            startMixingTimer(activeRarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        };

        // ✅ Обработчики для вкладок
        const hybridTabs = document.querySelectorAll('.hybrid-tab');
        hybridTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                hybridTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateLabUI();
            });
        });
    }

    // ✅ Функция обновления UI для активной вкладки
    function updateLabUI() {
        const activeRarity = getActiveRarity();
        const slot1El = document.getElementById('slot1');
        const slot2El = document.getElementById('slot2');
        const mixBtn = document.getElementById('mixBtn');
        const msgEl = document.getElementById('msg');

        if (gameState.hybridMixings[activeRarity]) {
            const mixing = gameState.hybridMixings[activeRarity];
            slot1El.innerHTML = `<span class="slot-emoji">${mixing.crop1}</span>`;
            slot1El.classList.add('filled');
            slot2El.innerHTML = `<span class="slot-emoji">${mixing.crop2}</span>`;
            slot2El.classList.add('filled');
            mixBtn.disabled = true;
            mixBtn.style.opacity = '0.5';
            slot1El.style.pointerEvents = 'none';
            slot2El.style.pointerEvents = 'none';
            startMixingTimer(activeRarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        } else {
            const crop1 = cropSelections[activeRarity].crop1;
            const crop2 = cropSelections[activeRarity].crop2;
            
            slot1El.innerHTML = crop1 ? `<span class="slot-emoji">${crop1}</span>` : '<span class="slot-placeholder">?</span>';
            slot1El.classList.toggle('filled', !!crop1);
            slot2El.innerHTML = crop2 ? `<span class="slot-emoji">${crop2}</span>` : '<span class="slot-placeholder">?</span>';
            slot2El.classList.toggle('filled', !!crop2);
            
            mixBtn.disabled = false;
            mixBtn.style.opacity = '1';
            slot1El.style.pointerEvents = 'all';
            slot2El.style.pointerEvents = 'all';
            msgEl.innerHTML = '';
        }
    }

    function getActiveRarity() {
        const activeTab = document.querySelector('.hybrid-tab.active');
        return activeTab ? activeTab.dataset.rarity : 'epic';
    }

    updateLabUI();
}

// ✅ Обновленная функция таймера с поддержкой редкости
function startMixingTimer(rarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixings[rarity];
    if (!mixing) return;
    
    if (mixingTimerIntervals[rarity]) {
        clearInterval(mixingTimerIntervals[rarity]);
        mixingTimerIntervals[rarity] = null;
    }
    
    const elapsed = Date.now() - mixing.startTime;
    let remainingTime = Math.max(0, Math.floor((mixing.duration - elapsed) / 1000));
    
    if (remainingTime === 0) {
        showClaimButton(rarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        return;
    }
    
    msgEl.innerHTML = `<div class="simple-timer" id="hybridTimer">${remainingTime}</div>`;
    const timerEl = document.getElementById('hybridTimer');
    
    mixingTimerIntervals[rarity] = setInterval(() => {
        remainingTime--;
        if (timerEl) timerEl.textContent = remainingTime;
        
        if (remainingTime <= 0) {
            clearInterval(mixingTimerIntervals[rarity]);
            mixingTimerIntervals[rarity] = null;
            
            if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
                tg.HapticFeedback.notificationOccurred('success');
            }
            showClaimButton(rarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El);
        }
    }, 1000);
}

function showClaimButton(rarity, gameState, tg, saveGameData, msgEl, mixBtn, slot1El, slot2El) {
    const mixing = gameState.hybridMixings[rarity];
    
    if (mixingTimerIntervals[rarity]) {
        clearInterval(mixingTimerIntervals[rarity]);
        mixingTimerIntervals[rarity] = null;
    }
    
    msgEl.innerHTML = `<button id="claimBtn" class="claim-hybrid-btn">${mixing.resultEmoji} ${mixing.resultName}</button>`;
    const claimBtn = document.getElementById('claimBtn');
    
    claimBtn.onclick = () => {
        gameState.warehouse[mixing.resultEmoji] = (gameState.warehouse[mixing.resultEmoji] || 0) + 1;
        gameState.hybridMixings[rarity] = null;
        cropSelections[rarity] = { crop1: null, crop2: null };
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
    };
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
        if (!gameState.hybridMixings) {
            gameState.hybridMixings = {
                epic: null,
                legendary: null,
                mythic: null
            };
        }

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
