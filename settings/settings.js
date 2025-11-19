// --- МОДУЛЬ НАСТРОЕК ---

class SettingsManager {
    constructor() {
        this.modal = null;
        this.nameInput = null;
        this.saveButton = null;
        this.cancelButton = null;
        this.errorMessage = null;
        this.successMessage = null;
        this.currentNameValue = null;
        this.inputCounter = null;
        this.maxLength = 20;
    }

    initialize() {
        console.log('🔧 Инициализация модуля настроек...');
        
        try {
            this.createSettingsModal();
            
            if (this.modal) {
                console.log('✅ Модальное окно создано');
                this.setupEventListeners();
                console.log('✅ Обработчики событий подключены');
            } else {
                console.error('❌ Ошибка: this.modal = null');
            }
        } catch (error) {
            console.error('❌ Ошибка при инициализации настроек:', error);
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
                    <div class="settings-section">
                        <div class="section-title">
                            <span class="section-icon">👤</span> Изменить имя
                        </div>
                        
                        <div class="current-name-display">
                            <div class="current-name-label">Текущее имя:</div>
                            <div class="current-name-value" id="current-name-value"></div>
                        </div>

                        <div class="name-input-group">
                            <div class="name-input-wrapper">
                                <input 
                                    type="text" 
                                    id="name-input" 
                                    placeholder="Введите новое имя..." 
                                    maxlength="20"
                                    autocomplete="off">
                                <span class="input-counter">0/20</span>
                            </div>
                            <div class="name-hint">Можно использовать русские, английские буквы и цифры (2-20 символов)</div>
                        </div>

                        <div class="name-error"></div>
                        <div class="name-success"></div>

                        <div class="settings-actions">
                            <button id="save-name-btn">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        // Получаем элементы
        this.nameInput = document.getElementById('name-input');
        this.saveButton = document.getElementById('save-name-btn');
        this.errorMessage = modal.querySelector('.name-error');
        this.successMessage = modal.querySelector('.name-success');
        this.currentNameValue = document.getElementById('current-name-value');
        this.inputCounter = modal.querySelector('.input-counter');
    }

    setupEventListeners() {
        // Кнопка закрытия - ИСПРАВЛЕНО!
        const closeButton = this.modal.querySelector('.settings-close');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('✖️ Клик по крестику');
                this.close();
            });
        }

        // Закрытие по клику на фон
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                console.log('🎯 Клик по фону');
                this.close();
            }
        });

        // Кнопка сохранения
        this.saveButton.addEventListener('click', () => {
            console.log('🎯 Клик по кнопке Сохранить');
            this.saveName();
        });

        // Валидация при вводе - ИСПРАВЛЕНО!
        this.nameInput.addEventListener('input', () => {
            const value = this.nameInput.value;
            
            // Очищаем сообщения об ошибках при вводе
            this.errorMessage.classList.remove('show');
            this.successMessage.classList.remove('show');
            
            if (value.length > 0) {
                this.validateInput();
            } else {
                // Если поле пустое, убираем все стили
                this.nameInput.classList.remove('error', 'success');
            }
            
            this.updateCounter();
        });

        // Сохранение по Enter
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.saveButton.disabled) {
                console.log('⌨️ Нажат Enter');
                this.saveName();
            }
        });
    }

    open() {
        if (this.modal && typeof userProfile !== 'undefined') {
            const currentName = userProfile.getUserName();
            this.currentNameValue.textContent = currentName || 'Не установлено';
            this.modal.classList.remove('hidden');
            this.nameInput.value = '';
            this.errorMessage.classList.remove('show');
            this.successMessage.classList.remove('show');
            this.nameInput.classList.remove('error', 'success');
            this.updateCounter();
            setTimeout(() => this.nameInput.focus(), 100);
        }
    }

    close() {
        console.log('🚪 Закрытие окна настроек');
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.resetForm();
        }
    }

    resetForm() {
        this.nameInput.value = '';
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
        this.nameInput.classList.remove('error', 'success');
        this.updateCounter();
    }

    validateInput() {
        const value = this.nameInput.value;
        const result = nameValidator.validate(value);
        
        if (value.length > 0 && !result.valid) {
            this.nameInput.classList.add('error');
            this.nameInput.classList.remove('success');
        } else if (result.valid) {
            this.nameInput.classList.remove('error');
            this.nameInput.classList.add('success');
        } else {
            this.nameInput.classList.remove('error', 'success');
        }
        
        return result;
    }

    updateCounter() {
        const length = this.nameInput.value.length;
        this.inputCounter.textContent = `${length}/${this.maxLength}`;
    }

    async saveName() {
        console.log('🎯 Начало сохранения имени...');
        
        const value = this.nameInput.value.trim();
        console.log('📝 Введённое значение:', value);
        
        // Проверка на пустое значение
        if (!value) {
            this.errorMessage.textContent = 'Введите имя';
            this.errorMessage.classList.add('show');
            this.nameInput.classList.add('error');
            console.log('❌ Поле пустое');
            return;
        }
        
        const result = nameValidator.validate(value);
        console.log('✅ Результат валидации:', result);
        
        if (!result.valid) {
            this.errorMessage.textContent = result.errors[0];
            this.errorMessage.classList.add('show');
            this.nameInput.classList.add('error');
            console.log('❌ Валидация не прошла');
            return;
        }
        
        const cleanName = result.cleanName;
        console.log('✨ Очищенное имя:', cleanName);
        
        // Проверка на совпадение с текущим именем
        if (typeof userProfile !== 'undefined') {
            const currentName = userProfile.getUserName();
            if (cleanName === currentName) {
                this.errorMessage.textContent = '⚠️ Вы уже используете это имя!';
                this.errorMessage.classList.add('show');
                this.nameInput.classList.add('error');
                console.log('⚠️ Имя совпадает с текущим');
                return;
            }
        }
        
        // Блокируем кнопку
        this.saveButton.disabled = true;
        const originalText = this.saveButton.textContent;
        this.saveButton.textContent = 'Сохранение...';
        console.log('🔒 Кнопка заблокирована');
        
        try {
            // Регистрация имени в реестре
            if (typeof nameRegistry !== 'undefined') {
                const userId = (typeof tg !== 'undefined' && tg.initDataUnsafe?.user?.id) || 'local_user';
                console.log('📝 Регистрация имени для пользователя:', userId);
                await nameRegistry.registerName(cleanName, userId);
                console.log('✅ Имя зарегистрировано в реестре');
            }
            
            // Сохранение в профиль
            if (typeof userProfile !== 'undefined') {
                console.log('💾 Сохранение в профиль...');
                const success = await userProfile.setUserName(cleanName);
                
                if (success) {
                    console.log('✅ Имя успешно сохранено!');
                    this.successMessage.textContent = '✅ Сохранено!';
                    this.successMessage.classList.add('show');
                    this.errorMessage.classList.remove('show');
                    this.nameInput.classList.remove('error', 'success');
                    this.currentNameValue.textContent = cleanName;
                    this.nameInput.value = ''; // Очищаем поле
                    this.updateCounter();
                    
                    // Закрываем окно через 1 секунду
                    setTimeout(() => {
                        this.close();
                    }, 1000);
                } else {
                    console.error('❌ userProfile.setUserName вернул false');
                    this.errorMessage.textContent = '❌ Ошибка сохранения';
                    this.errorMessage.classList.add('show');
                }
            }
        } catch (error) {
            console.error('❌ Ошибка при сохранении:', error);
            this.errorMessage.textContent = '❌ Ошибка: ' + error.message;
            this.errorMessage.classList.add('show');
        } finally {
            this.saveButton.disabled = false;
            this.saveButton.textContent = originalText;
            console.log('🔓 Кнопка разблокирована');
        }
    }
}

// Создание глобального экземпляра
const settingsManager = new SettingsManager();

// Функция инициализации
function initializeSettings() {
    settingsManager.initialize();
}
