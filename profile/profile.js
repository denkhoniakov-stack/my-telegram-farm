// --- МОДУЛЬ УПРАВЛЕНИЯ ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ---

const RANDOM_NAMES = [
  'Фермер', 'Садовод', 'Агроном', 'Дачник', 'Земледелец', 'Огородник', 
  'Овощевод', 'Растениевод', 'Урожайник', 'Ботаник', 'Сеятель', 'Пахарь'
];

class UserProfile {
    constructor() {
        this.userName = null;
        this.avatarId = 'default';
        this.isInitialized = false;

        this.userNameElement = document.getElementById('user-name');
        this.userAvatarElement = document.getElementById('user-avatar');
    }

    /**
     * Асинхронная инициализация. Загружает данные из облака или localStorage.
     * Этот метод должен быть вызван и дождаться завершения перед использованием профиля.
     */
    async initialize() {
        console.log('1. [PROFILE] Начало инициализации профиля...');
        
        const isCloud = typeof tg !== 'undefined' && tg.CloudStorage;
        
        try {
            if (isCloud) {
                // Загружаем из Telegram Cloud Storage
                this.userName = await this.getItemFromCloud('userName');
                this.avatarId = await this.getItemFromCloud('userAvatar') || 'default';
                console.log(`2. [PROFILE] Загружено из CloudStorage: ${this.userName}`);
            } else {
                // Загружаем из localStorage для локальной отладки
                this.userName = localStorage.getItem('userName');
                this.avatarId = localStorage.getItem('userAvatar') || 'default';
                console.log(`2. [PROFILE] Загружено из localStorage: ${this.userName}`);
            }

            // Если имени нет, генерируем новое и сохраняем
            if (!this.userName) {
                console.log('3. [PROFILE] Имя не найдено, генерируем новое...');
                this.userName = this.generateRandomName();
                await this.saveProfile(); // Сохраняем новое имя
            }

            this.isInitialized = true;
            console.log('4. [PROFILE] Инициализация завершена. Имя:', this.userName);
            this.updateDisplay();

        } catch (error) {
            console.error('❌ [PROFILE] КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ:', error);
            // Если облако не работает, используем localStorage как запасной вариант
            this.userName = localStorage.getItem('userName') || this.generateRandomName();
            this.updateDisplay();
        }
    }
    
    /**
     * Устанавливает новое имя и немедленно сохраняет его.
     */
    async setUserName(newName) {
        if (newName && newName.trim().length > 0) {
            this.userName = newName.trim();
            console.log(`[PROFILE] Установка нового имени: ${this.userName}`);
            await this.saveProfile();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    /**
     * Сохраняет текущие данные профиля в нужное хранилище.
     */
    async saveProfile() {
        console.log(`[PROFILE] Сохранение имени: ${this.userName}`);
        const isCloud = typeof tg !== 'undefined' && tg.CloudStorage;

        if (isCloud) {
            await this.setItemToCloud('userName', this.userName);
            await this.setItemToCloud('userAvatar', this.avatarId);
            console.log(`[PROFILE] Успешно сохранено в CloudStorage.`);
        } else {
            localStorage.setItem('userName', this.userName);
            localStorage.setItem('userAvatar', this.avatarId);
            console.log(`[PROFILE] Успешно сохранено в localStorage.`);
        }
    }

    // --- Вспомогательные методы ---

    getUserName() {
        return this.userName;
    }
    
    updateDisplay() {
        if (this.userNameElement) {
            this.userNameElement.textContent = this.userName;
        } else {
            // Повторная попытка, если элемент еще не отрисован
            setTimeout(() => {
                this.userNameElement = document.getElementById('user-name');
                if (this.userNameElement) this.userNameElement.textContent = this.userName;
            }, 500);
        }
    }

    generateRandomName() {
        return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    }

    // --- Promise-обертки для CloudStorage ---

    getItemFromCloud(key) {
        return new Promise((resolve, reject) => {
            tg.CloudStorage.getItem(key, (err, value) => {
                if (err) return reject(err);
                resolve(value);
            });
        });
    }

    setItemToCloud(key, value) {
        return new Promise((resolve, reject) => {
            tg.CloudStorage.setItem(key, value, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

const userProfile = new UserProfile();
