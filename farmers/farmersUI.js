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
        // Точный поиск аватара по ID
        const avatar = document.getElementById('user-avatar');
        
        if (avatar) {
            avatar.addEventListener('click', () => {
                console.log('[FARMERS UI] Клик по аватару!');
                this.open();
            });
            avatar.style.cursor = 'pointer';
            console.log('[FARMERS UI] ✅ Обработчик аватарки установлен');
        } else {
            console.error('[FARMERS UI] ❌ Элемент #user-avatar не найден');
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
        // Инициализация gameState.farmers если его нет
        if (typeof gameState === 'undefined') {
            window.gameState = { farmers: [] };
        }
        if (!gameState.farmers) {
            gameState.farmers = [];
        }
        
        const playerFarmers = gameState.farmers;
        
        // Обновляем статистику
        const totalEl = document.getElementById('total-farmers');
        const activeEl = document.getElementById('active-farmers');
        
        if (totalEl) totalEl.textContent = playerFarmers.length;
        if (activeEl) {
            activeEl.textContent = playerFarmers.filter(f => f.isActive).length;
        }

        // Отображаем коллекцию и слоты
        this.renderCollection(playerFarmers);
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
        
        const isActive = farmer.isActive;
        const btnText = isActive ? '✓ Активен' : 'Активировать';
        const btnClass = isActive ? 'activate-btn active' : 'activate-btn';

        // Используем картинку если есть, иначе иконку
        const iconHtml = farmer.image 
            ? `<img src="${farmer.image}" class="farmer-card-img" alt="${farmer.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px;">`
            : `<div class="farmer-icon" style="font-size: 50px;">${farmer.icon || '👨‍🌾'}</div>`;

        card.innerHTML = `
            ${iconHtml}
            <div class="farmer-name">${farmer.name}</div>
            <div class="farmer-rarity" style="color: ${farmer.color};">${this.getRarityText(farmer.rarity)}</div>
            <div class="farmer-bonus">${farmer.description}</div>
            ${farmer.duplicates > 0 ? `<div class="farmer-duplicates">+${farmer.duplicates} дубликатов</div>` : ''}
            <button class="${btnClass}" data-farmer-id="${farmer.id}">
                ${btnText}
            </button>
        `;

        // Добавляем обработчик прямо здесь
        const btn = card.querySelector('.activate-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы не срабатывал клик по карточке если он есть
            this.toggleFarmerActivation(farmer.id);
        });

        return card;
    }

    // Новый метод для переключения активации
    toggleFarmerActivation(farmerId) {
        if (typeof gameState === 'undefined') return;
        
        const farmer = gameState.farmers.find(f => f.id === farmerId);
        if (!farmer) return;

        if (farmer.isActive) {
            // Деактивация
            farmer.isActive = false;
            this.showNotification(`Фермер ${farmer.name} отправлен отдыхать`);
        } else {
            // Активация (проверка на макс. количество слотов - например 3)
            const activeCount = gameState.farmers.filter(f => f.isActive).length;
            if (activeCount >= 3) {
                this.showNotification('Нет свободных слотов! (Максимум 3)', 'error');
                return;
            }
            farmer.isActive = true;
            this.showNotification(`Фермер ${farmer.name} принялся за работу!`);
        }

        // Сохраняем и обновляем UI
        if (typeof saveGameState === 'function') saveGameState();
        this.updateDisplay();
    }

    showNotification(message, type = 'success') {
        // Используем вашу глобальную функцию или alert
        if (typeof showAlert === 'function') showAlert(message);
        else alert(message);
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
                // Используем картинку если есть, иначе иконку
                const iconHtml = farmer.image
                    ? `<img src="${farmer.image}" class="farmer-slot-img" alt="${farmer.name}">`
                    : `<div class="farmer-slot-fallback">${farmer.icon || '👨‍🌾'}</div>`;

                slot.style.borderColor = farmer.color;
                slot.innerHTML = `
                    <div class="active-slot-left">
                        <div class="slot-icon">${iconHtml}</div>
                        <div class="slot-name">${farmer.name}</div>
                    </div>
                    <div class="active-slot-right">
                        <div class="slot-bonus">${farmer.description}</div>
                        <button class="deactivate-btn" data-farmer-id="${farmer.id}">Убрать</button>
                    </div>
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
