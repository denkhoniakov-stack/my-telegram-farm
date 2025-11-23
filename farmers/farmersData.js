// ===================================================================
// БАЗА ДАННЫХ ФЕРМЕРОВ (farmersData.js)
// ===================================================================

const FARMERS_DATA = [
    // ==================== ОБЫЧНЫЕ (Common) - Серые ====================
    {
        id: 'farmer_001',
        name: 'Добрыня',
        rarity: 'common',
        color: '#9e9e9e',
        image: 'images/farmers/1.png',
        bonusType: 'growth',
        bonusValue: 5,
        description: 'Ускоряет рост растений на 5%'
    },
    {
        id: 'farmer_002',
        name: 'Ратибор',
        rarity: 'common',
        color: '#9e9e9e',
        image: 'images/farmers/2.png',
        bonusType: 'coins',
        bonusValue: 3,
        description: 'Увеличивает доход от продажи на 3%'
    },
    {
        id: 'farmer_003',
        name: 'Всеволод',
        rarity: 'common',
        color: '#9e9e9e',
        image: 'images/farmers/3.png',
        bonusType: 'growth',
        bonusValue: 5,
        description: 'Ускоряет рост растений на 5%'
    },
    {
        id: 'farmer_004',
        name: 'Любомир',
        rarity: 'common',
        color: '#9e9e9e',
        image: 'images/farmers/4.png',
        bonusType: 'coins',
        bonusValue: 3,
        description: 'Увеличивает доход от продажи на 3%'
    },
    {
        id: 'farmer_005',
        name: 'Радомир',
        rarity: 'common',
        color: '#9e9e9e',
        image: 'images/farmers/5.png',
        bonusType: 'growth',
        bonusValue: 5,
        description: 'Ускоряет рост растений на 5%'
    },

    // ==================== РЕДКИЕ (Rare) - Синие ====================
    {
        id: 'farmer_006',
        name: 'Святослав',
        rarity: 'rare',
        color: '#2196F3',
        image: 'images/farmers/6.png',
        bonusType: 'growth',
        bonusValue: 10,
        description: 'Ускоряет рост растений на 10%'
    },
    {
        id: 'farmer_007',
        name: 'Мстислав',
        rarity: 'rare',
        color: '#2196F3',
        image: 'images/farmers/7.png',
        bonusType: 'lab',
        bonusValue: 8,
        description: 'Ускоряет работу лаборатории на 8%'
    },
    {
        id: 'farmer_008',
        name: 'Владимир',
        rarity: 'rare',
        color: '#2196F3',
        image: 'images/farmers/8.png',
        bonusType: 'coins',
        bonusValue: 8,
        description: 'Увеличивает доход от продажи на 8%'
    },
    {
        id: 'farmer_009',
        name: 'Ярослав',
        rarity: 'rare',
        color: '#2196F3',
        image: 'images/farmers/9.png',
        bonusType: 'growth',
        bonusValue: 10,
        description: 'Ускоряет рост растений на 10%'
    },
    {
        id: 'farmer_010',
        name: 'Борислав',
        rarity: 'rare',
        color: '#2196F3',
        image: 'images/farmers/10.png',
        bonusType: 'doubleChance',
        bonusValue: 10,
        description: 'Шанс двойного урожая 10%'
    },

    // ==================== ЭПИЧЕСКИЕ (Epic) - Фиолетовые ====================
    {
        id: 'farmer_011',
        name: 'Вячеслав',
        rarity: 'epic',
        color: '#9C27B0',
        image: 'images/farmers/11.png',
        bonusType: 'growth',
        bonusValue: 15,
        description: 'Ускоряет рост растений на 15%'
    },
    {
        id: 'farmer_012',
        name: 'Изяслав',
        rarity: 'epic',
        color: '#9C27B0',
        image: 'images/farmers/12.png',
        bonusType: 'lab',
        bonusValue: 15,
        description: 'Ускоряет работу лаборатории на 15%'
    },
    {
        id: 'farmer_013',
        name: 'Ростислав',
        rarity: 'epic',
        color: '#9C27B0',
        image: 'images/farmers/13.png',
        bonusType: 'coins',
        bonusValue: 15,
        description: 'Увеличивает доход от продажи на 15%'
    },
    {
        id: 'farmer_014',
        name: 'Богдан',
        rarity: 'epic',
        color: '#9C27B0',
        image: 'images/farmers/14.png',
        bonusType: 'doubleChance',
        bonusValue: 20,
        description: 'Шанс двойного урожая 20%'
    },

    // ==================== ЛЕГЕНДАРНЫЕ (Legendary) - Золотистые ====================
    {
        id: 'farmer_015',
        name: 'Светозар',
        rarity: 'legendary',
        color: '#FFC107',
        image: 'images/farmers/15.png',
        bonusType: 'growth',
        bonusValue: 25,
        description: 'Ускоряет рост растений на 25%'
    },
    {
        id: 'farmer_016',
        name: 'Пересвет',
        rarity: 'legendary',
        color: '#FFC107',
        image: 'images/farmers/16.png',
        bonusType: 'lab',
        bonusValue: 25,
        description: 'Ускоряет работу лаборатории на 25%'
    },
    {
        id: 'farmer_017',
        name: 'Велимир',
        rarity: 'legendary',
        color: '#FFC107',
        image: 'images/farmers/17.png',
        bonusType: 'coins',
        bonusValue: 25,
        description: 'Увеличивает доход от продажи на 25%'
    },

    // ==================== МИФИЧЕСКИЕ (Mythic) - Красные ====================
    {
        id: 'farmer_018',
        name: 'Даждьбог',
        rarity: 'mythic',
        color: '#F44336',
        image: 'images/farmers/18.png',
        bonusType: 'growth',
        bonusValue: 40,
        description: 'Ускоряет рост растений на 40%'
    },
    {
        id: 'farmer_019',
        name: 'Сварог',
        rarity: 'mythic',
        color: '#F44336',
        image: 'images/farmers/19.png',
        bonusType: 'lab',
        bonusValue: 40,
        description: 'Ускоряет работу лаборатории на 40%'
    },
    {
        id: 'farmer_020',
        name: 'Перун',
        rarity: 'mythic',
        color: '#F44336',
        image: 'images/farmers/20.png',
        bonusType: 'coins',       
        bonusValue: 40,           
        description: 'Увеличивает доход от продажи на 40%'
    }
];

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FARMERS_DATA;
}
