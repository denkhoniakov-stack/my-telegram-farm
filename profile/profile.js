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
    
    // Ждём, пока DOM загрузится
    setTimeout(() => {
      this.userNameElement = document.getElementById('user-name');
      this.userAvatarElement = document.getElementById('user-avatar');
      this.updateDisplay();
      this.setupEventListeners();
    }, 100);
  }

  generateRandomName() {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    return RANDOM_NAMES[randomIndex];
  }

  loadProfile() {
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedName) {
      this.userName = savedName;
    } else {
      this.userName = this.generateRandomName();
      this.saveProfile();
    }

    if (savedAvatar) {
      this.avatarId = savedAvatar;
    }
  }

  saveProfile() {
    localStorage.setItem('userName', this.userName);
    localStorage.setItem('userAvatar', this.avatarId);
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

  setUserName(newName) {
    if (newName && newName.trim().length > 0) {
      this.userName = newName.trim();
      this.saveProfile();
      this.updateDisplay(); // ← Обновляем отображение
      console.log('✅ Имя успешно изменено на:', this.userName);
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
