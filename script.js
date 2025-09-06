// Подключаемся к Telegram
const tg = window.Telegram.WebApp;

// Получаем наши элементы со страницы
const plantButton = document.getElementById('plant-button');
const garden = document.getElementById('garden');

// При нажатии на кнопку "Посадить"
plantButton.addEventListener('click', () => {
    // Создаем новый элемент-растение
    const plant = document.createElement('div');
    plant.classList.add('plant');
    plant.innerText = '🌱'; // Сначала это росток
    
    // Добавляем росток на грядку
    garden.appendChild(plant);

    // Симулируем рост: через 5 секунд росток превратится в морковку
    setTimeout(() => {
        plant.innerText = '🥕'; // Выросла морковка!
        plant.style.cursor = 'pointer'; // Можно собрать
        
        // Добавляем возможность сбора урожая
        plant.addEventListener('click', () => {
            garden.removeChild(plant); // Убираем с грядки
            // Показываем всплывающее уведомление внутри Telegram
            tg.HapticFeedback.notificationOccurred('success');
            alert('Урожай собран!');
        }, { once: true }); // Сработает только один раз

    }, 5000); // 5000 миллисекунд = 5 секунд
});
