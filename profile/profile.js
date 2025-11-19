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

    async initialize() {
        console.log('[PROFILE] 1. Начало инициализации профиля...');
        
        const isCloud = typeof tg !== 'undefined' && tg.CloudStorage;
        
        try {
            if (isCloud) {
                // Загружаем из CloudStorage
                this.userName = await this.getItemFromCloud('userName');
                this.avatarId = await this.getItemFromCloud('userAvatar') || 'default';
                console.log(`[PROFILE] 2. Загружено из CloudStorage: "${this.userName}"`);

                // ТОЛЬКО если в облаке ПУСТО - генерируем новое имя
                if (!this.userName || this.userName === 'null' || this.userName === 'undefined') {
                    console.log('[PROFILE] 3. CloudStorage пустой, генерируем новое имя...');
                    this.userName = this.generateRandomName();
                    await this.saveProfile();
                    console.log('[PROFILE] 4. Новое имя сохранено в CloudStorage');
                }
                
            } else {
                // Локальная разработка - используем localStorage
                this.userName = localStorage.getItem('userName');
                this.avatarId = localStorage.getItem('userAvatar') || 'default';
                console.log(`[PROFILE] 2. Загружено из localStorage: ${this.userName}`);
                
                if (!this.userName) {
                    this.userName = this.generateRandomName();
                    this.saveProfile();
                }
            }

            this.isInitialized = true;
            console.log(`[PROFILE] 5. ✅ Инициализация завершена. Финальное имя: "${this.userName}"`);
            this.updateDisplay();

        } catch (error) {
            console.error('❌ [PROFILE] ОШИБКА:', error);
            this.userName = localStorage.getItem('userName') || this.generateRandomName();
            this.updateDisplay();
        }
    }
    
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

    async saveProfile() {
        console.log(`[PROFILE] Сохранение имени: "${this.userName}"`);
        const isCloud = typeof tg !== 'undefined' && tg.CloudStorage;

        if (isCloud) {
            await this.setItemToCloud('userName', this.userName);
            await this.setItemToCloud('userAvatar', this.avatarId);
            console.log(`[PROFILE] ✅ Успешно сохранено в CloudStorage.`);
        } else {
            localStorage.setItem('userName', this.userName);
            localStorage.setItem('userAvatar', this.avatarId);
            console.log(`[PROFILE] ✅ Успешно сохранено в localStorage.`);
        }
    }

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
