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
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 5,
        description: 'Ускоряет рост растений на 5%'
    },
    {
        id: 'farmer_002',
        name: 'Ратибор',
        rarity: 'common',
        color: '#9e9e9e',
        icon: '👨‍🌾',
        bonusType: 'coins',
        bonusValue: 3,
        description: 'Увеличивает доход от продажи на 3%'
    },
    {
        id: 'farmer_003',
        name: 'Всеволод',
        rarity: 'common',
        color: '#9e9e9e',
        icon: '🧑‍🌾',
        bonusType: 'growth',
        bonusValue: 5,
        description: 'Ускоряет рост растений на 5%'
    },
    {
        id: 'farmer_004',
        name: 'Любомир',
        rarity: 'common',
        color: '#9e9e9e',
        icon: '👨‍🌾',
        bonusType: 'coins',
        bonusValue: 3,
        description: 'Увеличивает доход от продажи на 3%'
    },
    {
        id: 'farmer_005',
        name: 'Радомир',
        rarity: 'common',
        color: '#9e9e9e',
        icon: '🧑‍🌾',
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
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 10,
        description: 'Ускоряет рост растений на 10%'
    },
    {
        id: 'farmer_007',
        name: 'Мстислав',
        rarity: 'rare',
        color: '#2196F3',
        icon: '👩‍🌾',
        bonusType: 'lab',
        bonusValue: 8,
        description: 'Ускоряет работу лаборатории на 8%'
    },
    {
        id: 'farmer_008',
        name: 'Владимир',
        rarity: 'rare',
        color: '#2196F3',
        icon: '🧑‍🌾',
        bonusType: 'coins',
        bonusValue: 8,
        description: 'Увеличивает доход от продажи на 8%'
    },
    {
        id: 'farmer_009',
        name: 'Ярослав',
        rarity: 'rare',
        color: '#2196F3',
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 10,
        description: 'Ускоряет рост растений на 10%'
    },
    {
        id: 'farmer_010',
        name: 'Борислав',
        rarity: 'rare',
        color: '#2196F3',
        icon: '👩‍🌾',
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
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 15,
        description: 'Ускоряет рост растений на 15%'
    },
    {
        id: 'farmer_012',
        name: 'Изяслав',
        rarity: 'epic',
        color: '#9C27B0',
        icon: '👩‍🌾',
        bonusType: 'lab',
        bonusValue: 15,
        description: 'Ускоряет работу лаборатории на 15%'
    },
    {
        id: 'farmer_013',
        name: 'Ростислав',
        rarity: 'epic',
        color: '#9C27B0',
        icon: '🧑‍🌾',
        bonusType: 'coins',
        bonusValue: 15,
        description: 'Увеличивает доход от продажи на 15%'
    },
    {
        id: 'farmer_014',
        name: 'Богдан',
        rarity: 'epic',
        color: '#9C27B0',
        icon: '👨‍🌾',
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
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 25,
        description: 'Ускоряет рост растений на 25%'
    },
    {
        id: 'farmer_016',
        name: 'Пересвет',
        rarity: 'legendary',
        color: '#FFC107',
        icon: '👩‍🌾',
        bonusType: 'lab',
        bonusValue: 25,
        description: 'Ускоряет работу лаборатории на 25%'
    },
    {
        id: 'farmer_017',
        name: 'Велимир',
        rarity: 'legendary',
        color: '#FFC107',
        icon: '🧑‍🌾',
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
        icon: '👨‍🌾',
        bonusType: 'growth',
        bonusValue: 40,
        description: 'Ускоряет рост растений на 40%'
    },
    {
        id: 'farmer_019',
        name: 'Сварог',
        rarity: 'mythic',
        color: '#F44336',
        icon: '👩‍🌾',
        bonusType: 'lab',
        bonusValue: 40,
        description: 'Ускоряет работу лаборатории на 40%'
    },
    {
        id: 'farmer_020',
        name: 'Перун',
        rarity: 'mythic',
        color: '#F44336',
        icon: '🧑‍🌾',
        bonusType: 'autoHarvest',
        bonusValue: 30,
        description: 'Автоматически собирает урожай каждые 30 секунд'
    }
];

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FARMERS_DATA;
}
