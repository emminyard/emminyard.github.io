document.addEventListener("DOMContentLoaded", function () {
    const countInput = document.getElementById("count");
    const productSelect = document.getElementById("product");
    const calcButton = document.getElementById("calc-btn");
    const resultParagraph = document.getElementById("result");
    calcButton.addEventListener("click", function () {
        const countValue = countInput.value;
        const numberPattern = /^\d+$/;
        if (!numberPattern.test(countValue)) {
            resultParagraph.textContent = "Ошибка: введите целое положительное число";
            return;
        }
        const count = parseInt(countValue);
        const price = parseInt(productSelect.value);
        const total = count * price;
        resultParagraph.textContent = "Стоимость заказа: " + total + " ₽";
    });
});