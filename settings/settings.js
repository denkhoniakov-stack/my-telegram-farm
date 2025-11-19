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

  // Инициализация модуля настроек
  initialize() {
      console.log('🔧 Инициализация модуля настроек...');
      
      try {
          this.createSettingsModal();
          
          // Проверяем ПОСЛЕ создания
          if (this.modal) {
              console.log('✅ Модальное окно создано');
              this.setupEventListeners();
              console.log('✅ Обработчики событий подключены');
          } else {
              console.error('❌ Ошибка: модальное окно не создалось (this.modal = null)');
          }
      } catch (error) {
          console.error('❌ Ошибка при инициализации настроек:', error);
      }
  }


  // Создание HTML-структуры модального окна
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
          <!-- Секция изменения имени -->
          <div class="settings-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Изменить имя
            </div>
            
            <div class="current-name-display">
              <div class="current-name-label">Текущее имя:</div>
              <div class="current-name-value" id="current-name-value">Игрок</div>
            </div>
            
            <div class="name-input-group">
              <div class="name-input-wrapper">
                <input 
                  type="text" 
                  id="name-input" 
                  placeholder="Введите новое имя..."
                  maxlength="20"
                  autocomplete="off"
                />
                <span class="input-counter" id="input-counter">0/20</span>
              </div>
              
              <div class="name-hint">
                Можно использовать русские, английские буквы и цифры (2-20 символов)
              </div>
              
              <div class="name-error" id="name-error"></div>
              <div class="name-success" id="name-success">✓ Имя успешно изменено!</div>
              
              <div class="name-buttons">
                <button class="cancel-name-btn" id="cancel-name-btn">Отмена</button>
                <button class="save-name-btn" id="save-name-btn">Сохранить</button>
              </div>
            </div>
          </div>
          
          <!-- Можно добавить другие секции настроек -->
          
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Сохраняем ссылки на элементы
    this.modal = modal;
    this.nameInput = document.getElementById('name-input');
    this.saveButton = document.getElementById('save-name-btn');
    this.cancelButton = document.getElementById('cancel-name-btn');
    this.errorMessage = document.getElementById('name-error');
    this.successMessage = document.getElementById('name-success');
    this.currentNameValue = document.getElementById('current-name-value');
    this.inputCounter = document.getElementById('input-counter');
  }

  // Настройка обработчиков событий
  setupEventListeners() {
  // Закрытие модального окна
    const closeButton = this.modal.querySelector('.settings-close');
    closeButton.addEventListener('click', () => this.close());

    // Закрытие по клику вне модального окна
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Кнопка отмены
    this.cancelButton.addEventListener('click', () => {
      this.resetForm();
      this.close();
    });

    // Кнопка сохранения
    this.saveButton.addEventListener('click', () => {
      this.saveName();
    });

    // Валидация при вводе
    this.nameInput.addEventListener('input', () => {
      this.validateInput();
      this.updateCounter();
    });

    // Сохранение по Enter
    this.nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveName();
      }
    });

    

  }

  // Открытие модального окна
  open() {
    // Обновляем отображение текущего имени
    if (typeof userProfile !== 'undefined') {
      this.currentNameValue.textContent = userProfile.getUserName();
    }
    
    this.resetForm();
    this.modal.classList.remove('hidden');
  }

  // Закрытие модального окна
  close() {
    this.modal.classList.add('hidden');
    this.resetForm();
  }

  // Сброс формы
  resetForm() {
    this.nameInput.value = '';
    this.nameInput.classList.remove('error', 'success');
    this.errorMessage.classList.remove('show');
    this.successMessage.classList.remove('show');
    this.saveButton.disabled = false;
    this.updateCounter();
  }

  // Обновление счетчика символов
  updateCounter() {
    const length = this.nameInput.value.length;
    this.inputCounter.textContent = `${length}/${this.maxLength}`;
    
    if (length >= this.maxLength) {
      this.inputCounter.style.color = '#ff6b6b';
    } else {
      this.inputCounter.style.color = '#999';
    }
  }

  // Валидация ввода
  validateInput() {
    const value = this.nameInput.value;
    
    if (value.length === 0) {
      this.nameInput.classList.remove('error', 'success');
      this.errorMessage.classList.remove('show');
      this.saveButton.disabled = false;
      return;
    }

    const result = nameValidator.validate(value);
    
    if (result.valid) {
      this.nameInput.classList.remove('error');
      this.nameInput.classList.add('success');
      this.errorMessage.classList.remove('show');
      this.saveButton.disabled = false;
    } else {
      this.nameInput.classList.add('error');
      this.nameInput.classList.remove('success');
      this.errorMessage.textContent = result.errors[0];
      this.errorMessage.classList.add('show');
      this.saveButton.disabled = true;
    }
  }

  // Сохранение нового имени
  async saveName() {
      const value = this.nameInput.value;
      const result = nameValidator.validate(value);
      
      if (!result.valid) {
          this.errorMessage.textContent = result.errors[0];
          this.errorMessage.classList.add('show');
          this.nameInput.classList.add('error');
          return;
      }
      
      const cleanName = result.cleanName;
      
      // Проверка на совпадение с текущим именем
      if (typeof userProfile !== 'undefined') {
          const currentName = userProfile.getUserName();
          if (cleanName === currentName) {
              this.errorMessage.textContent = '⚠️ Вы уже используете это имя!';
              this.errorMessage.classList.add('show');
              this.nameInput.classList.add('error');
              return;
          }
      }
      
      // Проверка уникальности среди всех пользователей
      if (typeof nameRegistry !== 'undefined' && nameRegistry.isNameTaken(cleanName)) {
          this.errorMessage.textContent = '❌ Имя "' + cleanName + '" уже занято!';
          this.errorMessage.classList.add('show');
          this.nameInput.classList.add('error');
          return;
      }
      
      // Блокируем кнопку
      this.saveButton.disabled = true;
      const originalText = this.saveButton.textContent;
      this.saveButton.textContent = 'Сохранение...';
      
      try {
          // Регистрируем имя в глобальном реестре
          if (typeof nameRegistry !== 'undefined') {
              const userId = (typeof tg !== 'undefined' && tg.initDataUnsafe?.user?.id) || 'local_user';
              await nameRegistry.registerName(cleanName, userId);
          }
          
          // Сохраняем в профиль
          if (typeof userProfile !== 'undefined') {
              const success = userProfile.setUserName(cleanName);
              
              if (success) {
                  this.successMessage.textContent = '✅ Сохранено!';
                  this.successMessage.classList.add('show');
                  this.errorMessage.classList.remove('show');
                  this.nameInput.classList.remove('error');
                  this.nameInput.classList.add('success');
                  this.currentNameValue.textContent = cleanName;
                  this.nameInput.value = '';
                  this.updateCounter();
                  
                  // Убираем сообщение об успехе через 2 секунды
                  setTimeout(() => {
                      this.successMessage.classList.remove('show');
                      this.nameInput.classList.remove('success');
                  }, 2000);
                  
                  // НЕ ЗАКРЫВАЕМ ОКНО - удалена строка this.close()
              } else {
                  this.errorMessage.textContent = '❌ Ошибка сохранения';
                  this.errorMessage.classList.add('show');
              }
          }
      } catch (error) {
          console.error('Ошибка:', error);
          this.errorMessage.textContent = '❌ Ошибка';
          this.errorMessage.classList.add('show');
      } finally {
          this.saveButton.disabled = false;
          this.saveButton.textContent = originalText;
      }
  }

}

// Создаем глобальный экземпляр менеджера настроек
const settingsManager = new SettingsManager();

// Функция инициализации (вызывается из main script)
function initializeSettings() {
  settingsManager.initialize();
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SettingsManager, settingsManager, initializeSettings };
}
