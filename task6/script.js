document.addEventListener("DOMContentLoaded", function () {
    
    // Находим элементы
    const quantityInput = document.getElementById("quantity");
    const productRadios = document.getElementsByName("productType");
    const optionsBlock = document.getElementById("options-block");
    const propertiesBlock = document.getElementById("properties-block");
    const productOption = document.getElementById("productOption");
    const propertyCheckboxes = document.querySelectorAll('input[name="property"]');
    const totalPriceParagraph = document.getElementById("total-price");
    
    // Базовые цены типов услуг
    const basePrices = {
        "1": 100,
        "2": 200,
        "3": 150
    };
    
    // Функция проверки и исправления количества
    function validateQuantity() {
        let value = quantityInput.value;
        
        // Убираем всё, что не цифра (на случай, если браузер пропустил)
        value = value.replace(/\D/g, "");
        
        // Убираем ведущие нули (007 → 7)
        value = value.replace(/^0+/, "");
        
        // Если пусто или меньше 1 — ставим 1
        if (value === "" || parseInt(value) < 1) {
            value = "1";
        }
        
        quantityInput.value = value;
    }
    
    // Функция подсчёта стоимости
    function calculatePrice() {
        // Сначала проверяем количество
        validateQuantity();
        
        // Количество
        let quantity = parseInt(quantityInput.value) || 1;
        
        // Выбранный тип услуги
        let selectedType = "1";
        productRadios.forEach(function(radio) {
            if (radio.checked) {
                selectedType = radio.value;
            }
        });
        
        // Базовая цена
        let price = basePrices[selectedType] || 0;
        
        // Показываем/скрываем блоки
        if (selectedType === "1") {
            optionsBlock.style.display = "none";
            propertiesBlock.style.display = "none";
        } else if (selectedType === "2") {
            optionsBlock.style.display = "block";
            propertiesBlock.style.display = "none";
        } else if (selectedType === "3") {
            optionsBlock.style.display = "none";
            propertiesBlock.style.display = "block";
        }
        
        // Добавляем стоимость опции (только для типа 2)
        if (selectedType === "2") {
            price += parseInt(productOption.value) || 0;
        }
        
        // Добавляем стоимость свойств (только для типа 3)
        if (selectedType === "3") {
            propertyCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    price += parseInt(checkbox.value) || 0;
                }
            });
        }
        
        // Итог = цена × количество
        const total = price * quantity;
        
        // Выводим
        totalPriceParagraph.textContent = "Стоимость: " + total + " ₽";
    }
    
    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    
    // Ввод количества
    quantityInput.addEventListener("input", calculatePrice);
    
    // При потере фокуса — тоже проверяем
    quantityInput.addEventListener("blur", calculatePrice);
    
    // Смена типа услуги
    productRadios.forEach(function(radio) {
        radio.addEventListener("change", calculatePrice);
    });
    
    // Смена опции
    productOption.addEventListener("change", calculatePrice);
    
    // Смена чекбоксов
    propertyCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", calculatePrice);
    });
    
    // Первоначальный расчёт
    calculatePrice();
});