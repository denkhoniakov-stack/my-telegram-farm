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
    }

    /**
     * Асинхронная инициализация с миграцией данных.
     */
    async initialize() {
        console.log('[PROFILE] 1. Начало инициализации профиля...');
        
        const isCloud = typeof tg !== 'undefined' && tg.CloudStorage;
        
        try {
            if (isCloud) {
                // Пытаемся загрузить из CloudStorage
                this.userName = await this.getItemFromCloud('userName');
                this.avatarId = await this.getItemFromCloud('userAvatar') || 'default';
                console.log(`[PROFILE] 2. Загружено из Cloud: ${this.userName}`);

                // *** МИГРАЦИЯ ДАННЫХ ***
                // Если в облаке пусто, а в localStorage что-то есть - переносим!
                if (!this.userName && localStorage.getItem('userName')) {
                    console.warn('[PROFILE] Облако пустое. Запускаем миграцию из localStorage...');
                    const localName = localStorage.getItem('userName');
                    const localAvatar = localStorage.getItem('userAvatar');
                    
                    this.userName = localName;
                    if (localAvatar) this.avatarId = localAvatar;
                    
                    await this.saveProfile(); // Сохраняем перенесенные данные в облако
                    console.log(`[PROFILE] ✅ Миграция завершена. Имя "${localName}" перенесено в CloudStorage.`);
                }
                
            } else {
                // Для локальной отладки
                this.userName = localStorage.getItem('userName');
                this.avatarId = localStorage.getItem('userAvatar') || 'default';
                console.log(`[PROFILE] 2. Загружено из localStorage: ${this.userName}`);
            }

            // Если имени все еще нет, генерируем новое
            if (!this.userName) {
                console.log('[PROFILE] 3. Имя не найдено, генерируем новое...');
                this.userName = this.generateRandomName();
                await this.saveProfile();
            }

            this.isInitialized = true;
            console.log(`[PROFILE] 4. Инициализация завершена. Финальное имя: ${this.userName}`);
            this.updateDisplay();

        } catch (error) {
            console.error('❌ [PROFILE] КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ:', error);
            // Запасной вариант при ошибках
            this.userName = localStorage.getItem('userName') || this.generateRandomName();
            this.updateDisplay();
        }
    }
    
    /**
     * Устанавливает новое имя и сохраняет его.
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
     * Сохраняет профиль в нужное хранилище.
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
