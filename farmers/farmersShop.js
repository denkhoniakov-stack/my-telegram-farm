// ===================================================================
// МАГАЗИН ФЕРМЕРОВ - СИСТЕМА ОТКРЫТИЯ ЯЩИКОВ (farmersShop.js)
// ===================================================================

class FarmersShop {
    constructor() {
        this.isOpening = false;
        // Используем функцию для получения актуального gameState
        this.getGameState = () => window.gameState;
    }

    // Конфигурация ящиков
    getBoxes() {
        return [
            {
                id: 'wooden',
                name: 'Деревянный ящик',
                icon: '📦',
                cost: 100,
                description: 'Базовый ящик',
                chances: {
                    common: 70,      // 70%
                    rare: 25,        // 25%
                    epic: 5,         // 5%
                    legendary: 0,    // 0%
                    mythic: 0        // 0%
                }
            },
            {
                id: 'silver',
                name: 'Серебряный ящик',
                icon: '🎁',
                cost: 500,
                description: 'Улучшенный ящик',
                chances: {
                    common: 40,      // 40%
                    rare: 45,        // 45%
                    epic: 14,        // 14%
                    legendary: 1,    // 1%
                    mythic: 0        // 0%
                }
            },
            {
                id: 'golden',
                name: 'Золотой ящик',
                icon: '🏆',
                cost: 2000,
                description: 'Редкий ящик',
                chances: {
                    common: 0,       // 0%
                    rare: 50,        // 50%
                    epic: 40,        // 40%
                    legendary: 9,    // 9%
                    mythic: 1        // 1%
                }
            },
            {
                id: 'diamond',
                name: 'Алмазный ящик',
                icon: '💎',
                cost: 10000,
                description: 'Легендарный ящик',
                chances: {
                    common: 0,       // 0%
                    rare: 0,         // 0%
                    epic: 45,        // 45%
                    legendary: 50,   // 50%
                    mythic: 5        // 5%
                }
            }
        ];
    }

    // Отображение ящиков в магазине
    renderShop() {
        const state = this.getGameState();
        
        if (!state) {
            console.error('[FARMERS SHOP] gameState не найден!');
            return;
        }

        const container = document.querySelector('#boosters-tab ul');
        if (!container) {
            console.error('[FARMERS SHOP] Контейнер #boosters-tab ul не найден');
            return;
        }

        container.innerHTML = '';
        const boxes = this.getBoxes();

        boxes.forEach(box => {
            const li = document.createElement('li');
            li.className = 'shop-item box-item';
            
            // Используем state.balance вместо coins
            const canAfford = state.balance >= box.cost;
            
            li.innerHTML = `
                <div class="box-icon">${box.icon}</div>
                <div class="box-details">
                    <div class="box-title">${box.name}</div>
                    <div class="box-description">${box.description}</div>
                    <div class="box-chances">
                        ${this.renderChances(box.chances)}
                    </div>
                </div>
                <div class="box-buy">
                    <button class="buy-box-button ${!canAfford ? 'disabled' : ''}" 
                            data-box-id="${box.id}" 
                            ${!canAfford ? 'disabled' : ''}>
                        ${box.cost.toFixed(0)} 🪙
                    </button>
                </div>
            `;
            
            container.appendChild(li);
        });

        // Добавляем обработчики
        this.attachBuyHandlers();
        
        console.log('[FARMERS SHOP] ✅ Магазин отображен, ящиков:', boxes.length);
    }

    renderChances(chances) {
        const rarityColors = {
            common: '#9e9e9e',
            rare: '#2196F3',
            epic: '#9C27B0',
            legendary: '#FFC107',
            mythic: '#F44336'
        };

        let html = '<div class="chances-list">';
        for (let [rarity, chance] of Object.entries(chances)) {
            if (chance > 0) {
                html += `<span class="chance-item" style="color: ${rarityColors[rarity]}">${chance}%</span>`;
            }
        }
        html += '</div>';
        return html;
    }

    attachBuyHandlers() {
        const buttons = document.querySelectorAll('.buy-box-button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isOpening) return;
                const boxId = btn.dataset.boxId;
                this.openBox(boxId);
            });
        });
    }

    // Открытие ящика
    // Открытие ящика
    async openBox(boxId) {
        // Безопасно получаем gameState
        if (typeof gameState === 'undefined' && typeof window.gameState === 'undefined') {
            console.error('[FARMERS SHOP] gameState не определен');
            this.showNotification('Ошибка: игра не инициализирована', 'error');
            return;
        }
        const state = window.gameState || gameState;

        const boxes = this.getBoxes();
        const box = boxes.find(b => b.id === boxId);
        
        if (!box) return;
        
        // Проверка монет
        if (state.balance < box.cost) {
            this.showNotification('Недостаточно монет!', 'error');
            return;
        }

        this.isOpening = true;

        // Списываем монеты из общего баланса
        state.balance -= box.cost;

        // ✅ ПРАВИЛЬНО ОБНОВЛЯЕМ ОТОБРАЖЕНИЕ БАЛАНСА
        if (typeof updateBalanceDisplay === 'function') {
            updateBalanceDisplay();
        } else if (typeof updateCoinsDisplay === 'function') {
            // На случай, если где‑то всё-таки есть старая функция
            updateCoinsDisplay();
        }

        // Сохраняем игру (используется твоя функция из script.js)
        if (typeof saveGameData === 'function') {
            saveGameData();
        } else if (typeof saveGameState === 'function') {
            saveGameState();
        }

        // Определяем редкость выпавшего фермера
        const rarity = this.rollRarity(box.chances);
        
        // Выбираем случайного фермера этой редкости
        const farmer = this.getRandomFarmer(rarity);
        
        if (!farmer) {
            console.error('Не удалось получить фермера');
            this.isOpening = false;
            return;
        }

        // Показываем анимацию открытия
        await this.showOpeningAnimation(box, farmer);
        
        // Добавляем фермера в коллекцию
        this.addFarmerToCollection(farmer);
        
        // Обновляем магазин (цены/кнопки после списания монет)
        this.renderShop();
        
        this.isOpening = false;
    }


    // Определение редкости по вероятностям
    rollRarity(chances) {
        const rand = Math.random() * 100;
        let cumulative = 0;

        for (let [rarity, chance] of Object.entries(chances)) {
            cumulative += chance;
            if (rand <= cumulative) {
                return rarity;
            }
        }
        
        return 'common'; // fallback
    }

    // Получение случайного фермера по редкости
    getRandomFarmer(rarity) {
        // Проверяем доступность базы данных фермеров
        if (typeof FARMERS_DATA === 'undefined') {
            console.error('[FARMERS SHOP] FARMERS_DATA не загружен!');
            return null;
        }

        const farmersOfRarity = FARMERS_DATA.filter(f => f.rarity === rarity);
        if (farmersOfRarity.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * farmersOfRarity.length);
        const farmerData = farmersOfRarity[randomIndex];
        
        // Создаём копию с уникальным ID экземпляра
        return {
            ...farmerData,
            instanceId: Date.now() + Math.random(),
            isActive: false,
            duplicates: 0
        };
    }

    // Добавление фермера в коллекцию
    addFarmerToCollection(farmer) {
        const state = this.getGameState();
        if (!state) return;

        if (!state.farmers) {
            state.farmers = [];
        }

        // Проверяем, есть ли уже такой фермер
        const existing = state.farmers.find(f => f.id === farmer.id);
        
        if (existing) {
            // Дубликат - увеличиваем счётчик
            existing.duplicates = (existing.duplicates || 0) + 1;
            console.log(`Получен дубликат ${farmer.name}. Всего: ${existing.duplicates + 1}`);
        } else {
            // Новый фермер
            state.farmers.push(farmer);
            console.log(`Получен новый фермер: ${farmer.name}`);
        }

        if (typeof saveGameState === 'function') saveGameState();
        else if (typeof saveGameData === 'function') saveGameData();
    }

    // Анимация открытия ящика
    async showOpeningAnimation(box, farmer) {
        return new Promise((resolve) => {
            // Создаём модальное окно анимации
            const modal = document.createElement('div');
            modal.className = 'box-opening-modal';
            modal.innerHTML = `
                <div class="box-opening-content">
                    <div class="box-animation">
                        <div class="box-icon-large shake">${box.icon}</div>
                        <div class="opening-text">Открываем...</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);

            // Через 2 секунды показываем результат
            setTimeout(() => {
                modal.querySelector('.box-animation').innerHTML = `
                    <div class="farmer-reveal" style="border-color: ${farmer.color}">
                        <div class="reveal-icon" style="font-size: 80px;">${farmer.icon}</div>
                        <div class="reveal-name" style="color: ${farmer.color}">${farmer.name}</div>
                        <div class="reveal-rarity">${this.getRarityText(farmer.rarity)}</div>
                        <div class="reveal-bonus">${farmer.description}</div>
                        <button class="claim-button">Забрать</button>
                    </div>
                `;

                // Кнопка "Забрать"
                modal.querySelector('.claim-button').addEventListener('click', () => {
                    modal.remove();
                    resolve();
                });
            }, 2000);
        });
    }

    getRarityText(rarity) {
        const names = {
            'common': 'Обычный',
            'rare': 'Редкий',
            'epic': 'Эпический',
            'legendary': 'Легендарный',
            'mythic': 'Мифический'
        };
        return names[rarity] || rarity;
    }

    showNotification(message, type) {
        // Пытаемся найти глобальную функцию уведомлений
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (typeof showAlert === 'function') {
            showAlert(message);
        } else {
            alert(message);
        }
    }
}

// Создаём глобальный экземпляр
const farmersShop = new FarmersShop();
