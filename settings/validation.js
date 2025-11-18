// --- МОДУЛЬ ВАЛИДАЦИИ ИМЕНИ ПОЛЬЗОВАТЕЛЯ ---

class NameValidator {
  constructor() {
    // Разрешенные символы: русские буквы, английские буквы, цифры, пробел
    this.validPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s]+$/;
    this.minLength = 2;
    this.maxLength = 20;
  }

  // Проверка имени на валидность
  validate(name) {
    const errors = [];

    // Проверка на пустое значение
    if (!name || name.trim().length === 0) {
      errors.push('Имя не может быть пустым');
      return { valid: false, errors };
    }

    const trimmedName = name.trim();

    // Проверка длины
    if (trimmedName.length < this.minLength) {
      errors.push(`Имя должно содержать минимум ${this.minLength} символа`);
    }

    if (trimmedName.length > this.maxLength) {
      errors.push(`Имя не должно превышать ${this.maxLength} символов`);
    }

    // Проверка на разрешенные символы
    if (!this.validPattern.test(trimmedName)) {
      errors.push('Имя может содержать только русские, английские буквы и цифры');
    }

    // Проверка на слишком много пробелов подряд
    if (/\s{2,}/.test(trimmedName)) {
      errors.push('Имя не должно содержать несколько пробелов подряд');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      cleanName: trimmedName
    };
  }

  // Очистка имени от лишних пробелов
  sanitize(name) {
    return name.trim().replace(/\s+/g, ' ');
  }
}

// Создаем глобальный экземпляр валидатора
const nameValidator = new NameValidator();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NameValidator, nameValidator };
}
