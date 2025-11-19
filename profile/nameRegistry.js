// --- РЕЕСТР ЗАНЯТЫХ ИМЁН ---

class NameRegistry {
  constructor() {
    this.registeredNames = new Set();
    this.currentUserName = null;
    this.currentUserId = null;
  }

  // Инициализация - загрузка списка занятых имён
  async initialize(userId) {
    this.currentUserId = userId || 'local_user';
    await this.loadRegisteredNames();
  }

  // Загрузка списка всех занятых имён
  async loadRegisteredNames() {
    return new Promise((resolve) => {
      // Проверяем, доступен ли tg
      const hasTelegram = typeof tg !== 'undefined' && tg.CloudStorage && typeof tg.CloudStorage.getItem === 'function';
      
      if (hasTelegram) {
        tg.CloudStorage.getItem('registeredNames', (err, data) => {
          if (!err && data) {
            try {
              const names = JSON.parse(data);
              this.registeredNames = new Set(names);
              console.log('✅ Загружено имён из Cloud:', this.registeredNames.size);
            } catch (e) {
              console.error('Ошибка загрузки имён:', e);
            }
          }
          resolve();
        });
      } else {
        // Fallback на localStorage
        const data = localStorage.getItem('registeredNames');
        if (data) {
          try {
            const names = JSON.parse(data);
            this.registeredNames = new Set(names);
            console.log('✅ Загружено имён из localStorage:', this.registeredNames.size);
          } catch (e) {
            console.error('Ошибка:', e);
          }
        }
        resolve();
      }
    });
  }

  // Сохранение списка занятых имён
  async saveRegisteredNames() {
    const namesArray = Array.from(this.registeredNames);
    const data = JSON.stringify(namesArray);

    return new Promise((resolve) => {
      const hasTelegram = typeof tg !== 'undefined' && tg.CloudStorage && typeof tg.CloudStorage.setItem === 'function';
      
      if (hasTelegram) {
        tg.CloudStorage.setItem('registeredNames', data, (err) => {
          if (!err) {
            console.log('✅ Имена сохранены в Cloud');
          }
          resolve(!err);
        });
      } else {
        localStorage.setItem('registeredNames', data);
        console.log('✅ Имена сохранены в localStorage');
        resolve(true);
      }
    });
  }

  // Проверка, занято ли имя
  isNameTaken(name) {
    const normalizedName = name.toLowerCase().trim();
    
    // Если это имя текущего пользователя - разрешаем
    if (this.currentUserName && normalizedName === this.currentUserName.toLowerCase()) {
      return false;
    }
    
    // Проверяем в списке занятых
    return this.registeredNames.has(normalizedName);
  }

  // Регистрация нового имени
  async registerName(name, userId) {
    const normalizedName = name.toLowerCase().trim();
    
    // Если меняем своё имя - сначала освобождаем старое
    if (this.currentUserName) {
      this.registeredNames.delete(this.currentUserName.toLowerCase());
    }
    
    // Регистрируем новое имя
    this.registeredNames.add(normalizedName);
    this.currentUserName = normalizedName;
    
    // Сохраняем
    await this.saveRegisteredNames();
    
    console.log('✅ Имя зарегистрировано:', name);
    return true;
  }

  // Освобождение имени
  async unregisterName(name) {
    const normalizedName = name.toLowerCase().trim();
    this.registeredNames.delete(normalizedName);
    await this.saveRegisteredNames();
  }

  // Получение всех имён
  getAllRegisteredNames() {
    return Array.from(this.registeredNames);
  }
}

// Создаём глобальный экземпляр
const nameRegistry = new NameRegistry();

// Функция инициализации
async function initializeNameRegistry() {
  const userId = (typeof tg !== 'undefined' && tg.initDataUnsafe?.user?.id) || 'local_user';
  await nameRegistry.initialize(userId);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NameRegistry, nameRegistry, initializeNameRegistry };
}
