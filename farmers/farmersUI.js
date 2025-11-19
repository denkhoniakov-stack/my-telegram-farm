// ===================================================================
// ИНТЕРФЕЙС КОЛЛЕКЦИИ ФЕРМЕРОВ (farmersUI.js)
// ===================================================================

class FarmersUI {
    constructor() {
        this.modal = null;
    }

    initialize() {
        this.createModal();
        this.attachEventListeners();
        console.log('[FARMERS UI] ✅ Интерфейс фермеров инициализирован');
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'farmers-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="farmers-modal-content">
                <div class="farmers-header">
                    <h2>🌾 Мои фермеры</h2>
                    <button class="close-modal" id="close-farmers">&times;</button>
                </div>
                
                <div class="farmers-stats">
                    <div class="stat-item">
                        <span class="stat-label">Всего фермеров:</span>
                        <span class="stat-value" id="total-farmers">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Активных:</span>
                        <span class="stat-value" id="active-farmers">0</span>
                    </div>
                </div>

                <div class="farmers-tabs">
                    <button class="farmers-tab active" data-tab="collection">📚 Коллекция</button>
                    <button class="farmers-tab" data-tab="active">⭐ Активные</button>
                </div>

                <div class="farmers-content">
                    <div id="collection-tab" class="farmers-tab-content active">
                        <div id="farmers-grid" class="farmers-grid">
                            <!-- Фермеры будут добавлены здесь -->
                        </div>
                    </div>
                    
                    <div id="active-tab" class="farmers-tab-content">
                        <div id="active-slots" class="active-slots">
                            <!-- Слоты для активных фермеров -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    attachEventListeners() {
        // Открытие по клику на аватарку
        const avatar = document.getElementById('user-avatar');
        if (avatar) {
            avatar.addEventListener('click', () => this.open());
            avatar.style.cursor = 'pointer';
            console.log('[FARMERS UI] Обработчик аватарки установлен');
        }

        // Закрытие модального окна
        const closeBtn = document.getElementById('close-farmers');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Закрытие по клику на фон
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Переключение вкладок
        const tabs = this.modal.querySelectorAll('.farmers-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Убираем active со всех вкладок
        this.modal.querySelectorAll('.farmers-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.modal.querySelectorAll('.farmers-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Добавляем active к выбранной вкладке
        const activeTab = this.modal.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = this.modal.querySelector(`#${tabName}-tab`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    open() {
        if (!this.modal) return;
        
        console.log('[FARMERS UI] Открытие коллекции фермеров');
        this.updateDisplay();
        this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }

    updateDisplay() {
        // Получаем список фермеров игрока (пока тестовые данные)
        const playerFarmers = gameState.farmers || [];
        
        // Обновляем статистику
        document.getElementById('total-farmers').textContent = playerFarmers.length;
        document.getElementById('active-farmers').textContent = 
            playerFarmers.filter(f => f.isActive).length;

        // Отображаем коллекцию
        this.renderCollection(playerFarmers);
        
        // Отображаем активных фермеров
        this.renderActiveSlots(playerFarmers);
    }

    renderCollection(farmers) {
        const grid = document.getElementById('farmers-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (farmers.length === 0) {
            grid.innerHTML = `
                <div class="empty-collection">
                    <div class="empty-icon">📦</div>
                    <p>У вас пока нет фермеров</p>
                    <p class="empty-hint">Откройте ящик в магазине!</p>
                </div>
            `;
            return;
        }

        farmers.forEach(farmer => {
            const card = this.createFarmerCard(farmer);
            grid.appendChild(card);
        });
    }

    createFarmerCard(farmer) {
        const card = document.createElement('div');
        card.className = `farmer-card rarity-${farmer.rarity}`;
        card.style.borderColor = farmer.color;
        
        card.innerHTML = `
            <div class="farmer-icon" style="font-size: 50px;">${farmer.icon}</div>
            <div class="farmer-name">${farmer.name}</div>
            <div class="farmer-rarity" style="color: ${farmer.color};">${this.getRarityText(farmer.rarity)}</div>
            <div class="farmer-bonus">${farmer.description}</div>
            ${farmer.duplicates > 0 ? `<div class="farmer-duplicates">+${farmer.duplicates} дубликатов</div>` : ''}
            <button class="activate-btn" data-farmer-id="${farmer.id}">
                ${farmer.isActive ? '✓ Активен' : 'Активировать'}
            </button>
        `;

        return card;
    }

    getRarityText(rarity) {
        const rarityNames = {
            'common': 'Обычный',
            'rare': 'Редкий',
            'epic': 'Эпический',
            'legendary': 'Легендарный',
            'mythic': 'Мифический'
        };
        return rarityNames[rarity] || rarity;
    }

    renderActiveSlots(farmers) {
        const slotsContainer = document.getElementById('active-slots');
        if (!slotsContainer) return;

        const activeFarmers = farmers.filter(f => f.isActive);
        const maxSlots = 5; // Максимум 5 активных фермеров

        slotsContainer.innerHTML = '';

        for (let i = 0; i < maxSlots; i++) {
            const farmer = activeFarmers[i];
            const slot = document.createElement('div');
            slot.className = 'active-slot';

            if (farmer) {
                slot.style.borderColor = farmer.color;
                slot.innerHTML = `
                    <div class="slot-icon">${farmer.icon}</div>
                    <div class="slot-name">${farmer.name}</div>
                    <div class="slot-bonus">${farmer.description}</div>
                    <button class="deactivate-btn" data-farmer-id="${farmer.id}">Убрать</button>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = `
                    <div class="slot-placeholder">Пусто</div>
                    <div class="slot-hint">Активируйте фермера из коллекции</div>
                `;
            }

            slotsContainer.appendChild(slot);
        }
    }
}

// Создаём глобальный экземпляр
const farmersUI = new FarmersUI();
