// --- МОДУЛЬ НАСТРОЕК ---

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
        if (this.modal) {
            this.setupEventListeners();
            console.log('[SETTINGS] ✅ Модуль настроек инициализирован');
        }
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'modal hidden';
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

    setupEventListeners() {
        // Кнопка закрытия
        const closeBtn = this.modal.querySelector('.settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('[SETTINGS] Закрытие настроек');
                this.close();
            });
        }

        // Закрытие по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        console.log('[SETTINGS] Базовые обработчики установлены');
    }

    // НОВЫЙ МЕТОД: Обновление ссылок на элементы
    updateElementReferences() {
        this.nameInput = document.getElementById('name-input');
        this.saveButton = document.getElementById('save-name-btn');
        this.errorMessage = this.modal.querySelector('.name-error');
        this.successMessage = this.modal.querySelector('.name-success');
        this.currentNameValue = document.getElementById('current-name-value');
        
        console.log('[SETTINGS] Элементы обновлены:', {
            nameInput: !!this.nameInput,
            saveButton: !!this.saveButton,
            errorMessage: !!this.errorMessage,
            successMessage: !!this.successMessage,
            currentNameValue: !!this.currentNameValue
        });
    }

    // НОВЫЙ МЕТОД: Установка обработчиков для кнопки сохранения
    attachSaveButtonHandler() {
        if (this.saveButton) {
            // Удаляем старый обработчик (если есть)
            const newButton = this.saveButton.cloneNode(true);
            this.saveButton.parentNode.replaceChild(newButton, this.saveButton);
            this.saveButton = newButton;
            
            // Устанавливаем новый обработчик
            this.saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[SETTINGS] 🔴 Клик по кнопке сохранения!');
                this.saveName();
            });
            
            console.log('[SETTINGS] ✅ Обработчик кнопки сохранения установлен');
        } else {
            console.error('[SETTINGS] ❌ Кнопка сохранения не найдена!');
        }
        
        // Обработчик Enter в поле ввода
        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('[SETTINGS] Нажат Enter');
                    this.saveName();
                }
            });
            this.nameInput.addEventListener('input', () => this.clearMessages());
        }
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
        
        // ВАЖНО: Обновляем ссылки на элементы при каждом открытии
        this.updateElementReferences();
        
        // ВАЖНО: Устанавливаем обработчик кнопки
        this.attachSaveButtonHandler();
        
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
            if (this.nameInput) {
                this.nameInput.focus();
            }
        }, 100);
    }

    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.clearMessages();
            if (this.nameInput) {
                this.nameInput.value = '';
            }
        }
    }

    async saveName() {
        console.log('[SETTINGS] 🔵 saveName() вызван');
        
        if (!this.nameInput) {
            console.error('[SETTINGS] Поле ввода не найдено');
            return;
        }

        const newName = this.nameInput.value.trim();
        console.log(`[SETTINGS] Введено имя: "${newName}"`);

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
                
                // Обновляем отображение текущего имени
                if (this.currentNameValue) {
                    this.currentNameValue.textContent = newName;
                }
                
                // Закрываем окно через 1.5 секунды
                setTimeout(() => {
                    this.close();
                }, 1500);
            } else {
                this.showError('Не удалось сохранить имя');
            }
        } catch (error) {
            console.error('[SETTINGS] ❌ Ошибка при сохранении:', error);
            this.showError('Произошла ошибка при сохранении');
        }
    }

    showError(message) {
        console.log('[SETTINGS] ⚠️ Показ ошибки:', message);
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
        if (this.successMessage) {
            this.successMessage.style.display = 'none';
        }
    }

    showSuccess(message) {
        console.log('[SETTINGS] ✅ Показ успеха:', message);
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
        }
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }

    clearMessages() {
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
            this.errorMessage.textContent = '';
        }
        if (this.successMessage) {
            this.successMessage.style.display = 'none';
            this.successMessage.textContent = '';
        }
    }
}

// Создаём глобальный экземпляр
const settingsManager = new SettingsManager();
