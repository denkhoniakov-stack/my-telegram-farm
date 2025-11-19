// --- МОДУЛЬ УПРАВЛЕНИЯ ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ---

const RANDOM_NAMES = [
    'Фермер', 'Садовод', 'Агроном', 'Дачник', 'Земледелец', 'Огородник',
    'Овощевод', 'Растениевод', 'Урожайник', 'Ботаник', 'Сеятель', 'Пахарь'
];

// Получаем объект Telegram WebApp или null
const tg = (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) 
    ? window.Telegram.WebApp 
    : null;

class UserProfile {
    constructor() {
        this.userName = null;
        this.avatarId = 'default';
        this.isInitialized = false;
        this.userNameElement = document.getElementById('user-name');
    }

    async initialize() {
        console.log('[PROFILE] 1. Начало инициализации профиля...');
        
        // Ждём инициализации CloudStorage (для Telegram Desktop)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Проверяем доступность CloudStorage
        const isCloud = tg && tg.CloudStorage && typeof tg.CloudStorage.getItem === 'function';
        console.log('[PROFILE] CloudStorage доступен?', isCloud);
        
        try {
            if (isCloud) {
                // === TELEGRAM CLOUD STORAGE ===
                console.log('[PROFILE] ✅ Используется CloudStorage');
                this.userName = await this.getItemFromCloud('userName');
                this.avatarId = await this.getItemFromCloud('userAvatar') || 'default';
                
                if (!this.userName || this.userName === 'null' || this.userName === 'undefined' || this.userName.trim() === '') {
                    console.log('[PROFILE] 3. CloudStorage пустой. Генерируем имя...');
                    this.userName = this.generateRandomName();
                    await this.saveProfile();
                }
            } else {
                // === FALLBACK: localStorage ===
                console.log('[PROFILE] ⚠️ CloudStorage недоступен, используем localStorage');
                this.userName = localStorage.getItem('userName');
                this.avatarId = localStorage.getItem('userAvatar') || 'default';
                
                if (!this.userName) {
                    this.userName = this.generateRandomName();
                    localStorage.setItem('userName', this.userName);
                }
            }
            
            this.isInitialized = true;
            console.log(`[PROFILE] 5. ✅ Готово. Финальное имя: "${this.userName}"`);
            this.updateDisplay();
            
        } catch (error) {
            console.error('❌ [PROFILE] ОШИБКА:', error);
            this.userName = this.generateRandomName();
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
        const isCloud = tg && tg.CloudStorage;
        
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

    getItemFromCloud(key) {
        return new Promise((resolve, reject) => {
            if (!tg || !tg.CloudStorage) {
                return reject(new Error('CloudStorage недоступен'));
            }
            
            tg.CloudStorage.getItem(key, (err, value) => {
                if (err) return reject(err);
                resolve(value);
            });
        });
    }

    setItemToCloud(key, value) {
        return new Promise((resolve, reject) => {
            if (!tg || !tg.CloudStorage) {
                return reject(new Error('CloudStorage недоступен'));
            }
            
            tg.CloudStorage.setItem(key, value, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
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
                if (this.userNameElement) {
                    this.userNameElement.textContent = this.userName;
                }
            }, 500);
        }
    }

    generateRandomName() {
        return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    }
}

// Создаём глобальный экземпляр профиля
const userProfile = new UserProfile();
