// --- МОДУЛЬ УПРАВЛЕНИЯ ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ---

const RANDOM_NAMES = [
  'Фермер', 'Садовод', 'Агроном', 'Дачник', 'Земледелец',
  'Огородник', 'Овощевод', 'Растениевод', 'Урожайник', 'Ботаник',
  'Сеятель', 'Пахарь', 'Жнец', 'Плантатор', 'Культиватор',
  'Хозяин', 'Труженик', 'Посевник', 'Урожаец', 'Зеленщик'
];

class UserProfile {
  constructor() {
    this.userName = null;
    this.avatarId = 'default';
    this.userNameElement = null;
    this.userAvatarElement = null;
  }

  initialize() {
      this.loadProfile();
      
      setTimeout(() => {
          this.userNameElement = document.getElementById('user-name');
          this.userAvatarElement = document.getElementById('user-avatar');
          this.updateDisplay();
          this.setupEventListeners();
      }, 300); // Увеличили до 300мс для CloudStorage
  }

  generateRandomName() {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    return RANDOM_NAMES[randomIndex];
  }

  loadProfile() {
      // Проверяем, доступен ли Telegram CloudStorage
      if (typeof tg !== 'undefined' && tg.CloudStorage && typeof tg.CloudStorage.getItem === 'function') {
          // Загружаем из CloudStorage
          tg.CloudStorage.getItem('userName', (err, savedName) => {
              if (!err && savedName) {
                  this.userName = savedName;
                  console.log('✅ Имя загружено из CloudStorage:', savedName);
              } else {
                  this.userName = this.generateRandomName();
                  this.saveProfile();
              }
              
              // Обновляем отображение после загрузки
              setTimeout(() => this.updateDisplay(), 200);
          });
          
          tg.CloudStorage.getItem('userAvatar', (err, savedAvatar) => {
              if (!err && savedAvatar) {
                  this.avatarId = savedAvatar;
              }
          });
      } else {
          // Fallback на localStorage
          const savedName = localStorage.getItem('userName');
          const savedAvatar = localStorage.getItem('userAvatar');

          if (savedName) {
              this.userName = savedName;
              console.log('✅ Имя загружено из localStorage:', savedName);
          } else {
              this.userName = this.generateRandomName();
              this.saveProfile();
          }

          if (savedAvatar) {
              this.avatarId = savedAvatar;
          }
      }
  }


  async saveProfile() {
      const userName = this.userName;
      const avatarId = this.avatarId;
      
      // Проверяем, доступен ли Telegram CloudStorage
      if (typeof tg !== 'undefined' && tg.CloudStorage && typeof tg.CloudStorage.setItem === 'function') {
          // Сохраняем в CloudStorage
          return new Promise((resolve) => {
              tg.CloudStorage.setItem('userName', userName, (err) => {
                  if (!err) {
                      console.log('✅ Имя сохранено в CloudStorage');
                      tg.CloudStorage.setItem('userAvatar', avatarId, (err2) => {
                          resolve(!err2);
                      });
                  } else {
                      console.error('❌ Ошибка сохранения в CloudStorage:', err);
                      resolve(false);
                  }
              });
          });
      } else {
          // Fallback на localStorage
          localStorage.setItem('userName', userName);
          localStorage.setItem('userAvatar', avatarId);
          console.log('✅ Имя сохранено в localStorage');
          return Promise.resolve(true);
      }
  }



  updateDisplay() {
    // Проверяем элемент заново на случай, если его ещё нет
    if (!this.userNameElement) {
      this.userNameElement = document.getElementById('user-name');
    }
    
    if (this.userNameElement) {
      this.userNameElement.innerText = this.userName;
      this.userNameElement.textContent = this.userName;
      console.log('✅ Имя обновлено на экране:', this.userName);
    } else {
      console.warn('⚠️ Элемент user-name не найден, повторная попытка...');
      // Пробуем ещё раз через 500мс
      setTimeout(() => {
        this.userNameElement = document.getElementById('user-name');
        if (this.userNameElement) {
          this.userNameElement.innerText = this.userName;
          this.userNameElement.textContent = this.userName;
        }
      }, 500);
    }
    
    if (this.userAvatarElement) {
      this.userAvatarElement.innerHTML = '';
    }
  }

  async setUserName(newName) {
      if (newName && newName.trim().length > 0) {
          this.userName = newName.trim();
          await this.saveProfile(); // ← Добавили await!
          this.updateDisplay();
          console.log('✅ Имя изменено на:', this.userName);
          return true;
      }
      return false;
  }

  setAvatar(avatarId) {
    this.avatarId = avatarId;
    this.saveProfile();
    this.updateDisplay();
  }

  setupEventListeners() {
    if (this.userAvatarElement) {
      this.userAvatarElement.addEventListener('click', () => {
        console.log('Клик по аватарке');
        // Здесь в будущем будет открытие выбора аватарки
        // openAvatarSettings();
      });
    }
  }

  getUserName() {
    return this.userName;
  }

  getAvatarId() {
    return this.avatarId;
  }
}

const userProfile = new UserProfile();

function initializeUserProfile() {
  userProfile.initialize();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserProfile, initializeUserProfile, userProfile };
}
