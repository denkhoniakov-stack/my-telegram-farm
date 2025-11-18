// --- МОДУЛЬ УПРАВЛЕНИЯ ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ---

// Список случайных имен для генерации
const RANDOM_NAMES = [
  'Фермер', 'Садовод', 'Агроном', 'Дачник', 'Земледелец',
  'Огородник', 'Овощевод', 'Растениевод', 'Урожайник', 'Ботаник',
  'Сеятель', 'Пахарь', 'Жнец', 'Плантатор', 'Культиватор',
  'Хозяин', 'Труженик', 'Посевник', 'Урожаец', 'Зеленщик'
];

// Класс для управления профилем пользователя
class UserProfile {
  constructor() {
    this.userName = null;
    this.avatarId = 'default';
    this.userNameElement = null;
    this.userAvatarElement = null;
  }

  // Инициализация профиля
  initialize() {
    // Получаем элементы DOM
    this.userNameElement = document.getElementById('user-name');
    this.userAvatarElement = document.getElementById('user-avatar');

    // Загружаем сохраненные данные
    this.loadProfile();

    // Отображаем профиль
    this.updateDisplay();

    // Добавляем обработчик клика на аватарку (для будущего функционала)
    this.setupEventListeners();
  }

  // Генерация случайного имени
  generateRandomName() {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    return RANDOM_NAMES[randomIndex];
  }

  // Загрузка профиля из хранилища
  loadProfile() {
    // Проверяем localStorage
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedName) {
      this.userName = savedName;
    } else {
      // Генерируем новое случайное имя
      this.userName = this.generateRandomName();
      this.saveProfile();
    }

    if (savedAvatar) {
      this.avatarId = savedAvatar;
    }
  }

  // Сохранение профиля в хранилище
  saveProfile() {
    localStorage.setItem('userName', this.userName);
    localStorage.setItem('userAvatar', this.avatarId);
  }

  // Обновление отображения профиля
  updateDisplay() {
    if (this.userNameElement) {
      this.userNameElement.innerText = this.userName;
    }

    // В будущем здесь можно будет установить картинку аватарки
    if (this.userAvatarElement) {
      // Пока оставляем пустым
      this.userAvatarElement.innerHTML = '';
    }
  }

  // Установка нового имени (для будущего функционала настроек)
  setUserName(newName) {
    if (newName && newName.trim().length > 0) {
      this.userName = newName.trim();
      this.saveProfile();
      this.updateDisplay();
      return true;
    }
    return false;
  }

  // Установка новой аватарки (для будущего функционала)
  setAvatar(avatarId) {
    this.avatarId = avatarId;
    this.saveProfile();
    this.updateDisplay();
  }

  // Настройка обработчиков событий
  setupEventListeners() {
    if (this.userAvatarElement) {
      this.userAvatarElement.addEventListener('click', () => {
        // Здесь можно будет открыть меню выбора аватарки
        console.log('Клик по аватарке - здесь будет меню настроек');
        // В будущем: openAvatarSettings();
      });
    }
  }

  // Получить текущее имя пользователя
  getUserName() {
    return this.userName;
  }

  // Получить текущий ID аватарки
  getAvatarId() {
    return this.avatarId;
  }
}

// Создаем глобальный экземпляр профиля
const userProfile = new UserProfile();

// Функция для инициализации (вызывается из main script)
function initializeUserProfile() {
  userProfile.initialize();
}

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserProfile, initializeUserProfile, userProfile };
}
