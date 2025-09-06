document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Сообщаем Telegram, что приложение готово

    const availableBeds = document.querySelectorAll('.garden-bed.available');

    availableBeds.forEach(bed => {
        bed.addEventListener('click', () => {
            // Если грядка уже занята, ничего не делаем
            if (bed.innerHTML !== '') {
                return;
            }

            // Сажаем росток
            const plant = document.createElement('div');
            plant.classList.add('plant');
            plant.innerText = '🌱';
            bed.appendChild(plant);

            // Через 5 секунд росток превращается в морковку
            setTimeout(() => {
                plant.innerText = '🥕';
                
                // Добавляем возможность собрать урожай
                plant.addEventListener('click', (e) => {
                    e.stopPropagation(); // Останавливаем "всплытие" клика, чтобы не посадить сразу новое
                    bed.innerHTML = ''; // Очищаем грядку
                    tg.HapticFeedback.notificationOccurred('success'); // Вибрация
                    // Можно добавить всплывающее уведомление, как раньше
                    // tg.showAlert('Урожай собран!');
                }, { once: true });

            }, 5000); // 5 секунд
        });
    });
});
