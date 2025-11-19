// --- МОДУЛЬ НАСТРОЕК (ВЕРСИЯ С ДЕЛЕГИРОВАНИЕМ) ---

class SettingsManager {
    constructor() {
        this.modal = null;
        this.nameInput = null;
        this.saveButton = null;
        this.errorMessage = null;
        this.successMessage = null;
        this.currentNameValue = null;
    }

    initialize() {
        this.createSettingsModal();
        this.setupGlobalEventListeners(); // Используем один глобальный обработчик
        console.log('[SETTINGS] ✅ Модуль настроек инициализирован');
    }

    createSettingsModal() {
        // Если модальное окно уже есть, не создаем его заново
        if (document.getElementById('settings-modal')) {
            this.modal = document.getElementById('settings-modal');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'modal hidden';
        // Возвращаем оригинальную HTML структуру
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>⚙️ Настройки</h2>
                    <div class="settings-close">×</div>
                </div>
                <div class="settings-body">
                    <div class="section-title">👤 Изменить имя</div>
                    <div class="current-name-display">
                        <div class="current-name-label">Текущее имя:</div>
                        <div class="current-name-value" id="current-name-value"></div>
                    </div>
                    <div class="name-input-wrapper">
                        <input type="text" id="name-input" placeholder="Введите новое имя..." maxlength="20" autocomplete="off">
                    </div>
                    <div class="name-error"></div>
                    <div class="name-success"></div>
                    <div class="settings-actions">
                        <button id="save-name-btn">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        console.log('[SETTINGS] Модальное окно создано');
    }

    // ГЛАВНОЕ ИЗМЕНЕНИЕ: Один обработчик для всего документа
    setupGlobalEventListeners() {
        document.body.addEventListener('click', (e) => {
            // Клик по кнопке "Сохранить"
            if (e.target.id === 'save-name-btn') {
                e.preventDefault();
                console.log('[SETTINGS] 🔴 Клик по кнопке СОХРАНИТЬ (через делегирование)');
                this.saveName();
                return;
            }

            // Клик по кнопке "Закрыть"
            if (e.target.closest('.settings-close')) {
                console.log('[SETTINGS] Клик по кнопке ЗАКРЫТЬ');
                this.close();
                return;
            }

            // Клик по фону модального окна
            if (e.target.id === 'settings-modal') {
                console.log('[SETTINGS] Клик по фону');
                this.close();
                return;
            }
        });

        // Отдельный обработчик для Enter, так как он не является кликом
        document.body.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'name-input') {
                e.preventDefault();
                console.log('[SETTINGS] Нажат Enter');
                this.saveName();
            }
        });
        
        console.log('[SETTINGS] ✅ Глобальные обработчики событий установлены');
    }

    updateElementReferences() {
        this.nameInput = document.getElementById('name-input');
        this.saveButton = document.getElementById('save-name-btn');
        this.errorMessage = this.modal.querySelector('.name-error');
        this.successMessage = this.modal.querySelector('.name-success');
        this.currentNameValue = document.getElementById('current-name-value');
    }

    open() {
        if (!this.modal) {
            console.error('[SETTINGS] Модальное окно не создано');
            return;
        }
        
        if (typeof userProfile === 'undefined' || !userProfile.isInitialized) {
            console.error('[SETTINGS] Профиль не инициализирован');
            return;
        }
        
        console.log('[SETTINGS] Открытие настроек');
        
        // Обновляем ссылки на элементы при каждом открытии
        this.updateElementReferences();
        
        // Показываем текущее имя
        const currentName = userProfile.getUserName();
        if (this.currentNameValue) {
            this.currentNameValue.textContent = currentName;
        }
        
        // Очищаем поле ввода и сообщения
        if (this.nameInput) {
            this.nameInput.value = '';
        }
        this.clearMessages();
        
        this.modal.classList.remove('hidden');
        
        setTimeout(() => {
            if (this.nameInput) this.nameInput.focus();
        }, 100);
    }

    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.clearMessages();
        }
    }

    async saveName() {
        // Убедимся, что ссылки на элементы актуальны
        this.updateElementReferences();

        if (!this.nameInput) {
            console.error('[SETTINGS] ❌ Поле ввода не найдено');
            return;
        }

        const newName = this.nameInput.value.trim();
        console.log(`[SETTINGS] 🔵 Введено имя для сохранения: "${newName}"`);

        // Валидация
        if (newName.length < 2 || newName.length > 20) {
            this.showError('Имя должно быть от 2 до 20 символов');
            return;
        }

        const currentName = userProfile.getUserName();
        if (newName === currentName) {
            this.showError('Введите новое имя, отличное от текущего');
            return;
        }

        try {
            console.log('[SETTINGS] 🟢 Попытка сохранить имя через userProfile...');
            const success = await userProfile.setUserName(newName);
            
            if (success) {
                this.showSuccess('✅ Имя успешно сохранено!');
                if (this.currentNameValue) this.currentNameValue.textContent = newName;
                setTimeout(() => this.close(), 1500);
            } else {
                this.showError('Не удалось сохранить имя');
            }
        } catch (error) {
            console.error('[SETTINGS] ❌ Ошибка при сохранении:', error);
            this.showError('Произошла ошибка при сохранении');
        }
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
        if (this.successMessage) this.successMessage.style.display = 'none';
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
        }
        if (this.errorMessage) this.errorMessage.style.display = 'none';
    }

    clearMessages() {
        if (this.errorMessage) this.errorMessage.style.display = 'none';
        if (this.successMessage) this.successMessage.style.display = 'none';
    }
}

// Создаём глобальный экземпляр
const settingsManager = new SettingsManager();
