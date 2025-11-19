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
        this.nameInput = document.getElementById('name-input');
        this.saveButton = document.getElementById('save-name-btn');
        this.errorMessage = modal.querySelector('.name-error');
        this.successMessage = modal.querySelector('.name-success');
        this.currentNameValue = document.getElementById('current-name-value');
    }

    setupEventListeners() {
        this.modal.querySelector('.settings-close').addEventListener('click', () => this.close());
        this.saveButton.addEventListener('click', () => this.saveName());
        this.nameInput.addEventListener('input', () => this.clearMessages());
    }

    open() {
        if (!this.modal || !userProfile.isInitialized) {
            console.error("Настройки не могут быть открыты: профиль не инициализирован.");
            return;
        }
        this.currentNameValue.textContent = userProfile.getUserName();
        this.modal.classList.remove('hidden');
        this.nameInput.focus();
    }

    close() {
        this.modal.classList.add('hidden');
        this.resetForm();
    }

    resetForm() {
        this.nameInput.value = '';
        this.clearMessages();
    }

    clearMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    async saveName() {
        console.log('[SETTINGS] Начинаем сохранение...');
        const newName = this.nameInput.value.trim();
        
        if (!newName) {
            this.showError('Имя не может быть пустым.');
            return;
        }
        if (newName === userProfile.getUserName()) {
            this.showError('Это ваше текущее имя.');
            return;
        }
        
        this.saveButton.disabled = true;
        this.saveButton.textContent = 'Сохранение...';
        this.clearMessages();

        try {
            const success = await userProfile.setUserName(newName);

            if (success) {
                console.log('[SETTINGS] Имя успешно сохранено.');
                this.showSuccess('✅ Сохранено!');
                this.currentNameValue.textContent = newName;
                userProfile.updateDisplay(); 
                
                setTimeout(() => {
                    this.close();
                }, 1000);

            } else {
                throw new Error('Метод setUserName вернул false.');
            }

        } catch (error) {
            console.error('❌ [SETTINGS] Ошибка:', error);
            this.showError('Не удалось сохранить.');
        } finally {
            this.saveButton.disabled = false;
            this.saveButton.textContent = 'Сохранить';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
    }

    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.classList.add('show');
    }
}

const settingsManager = new SettingsManager();
