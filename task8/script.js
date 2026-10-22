document.addEventListener("DOMContentLoaded", function () {
    
    const openBtn = document.getElementById("open-form-btn");
    const closeBtn = document.getElementById("close-form-btn");
    const popup = document.getElementById("popup");
    const form = document.getElementById("contact-form");
    const statusDiv = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    // ВАЖНО: Замени этот URL на свой endpoint с formcarry.com
    const FORMCARRY_ENDPOINT = "https://formcarry.com/s/ВАШ_ID";
    const STORAGE_KEY = "contact_form_data";

    // --- 1. Валидация ввода ---
    const fioInput = document.getElementById("fio");
    const phoneInput = document.getElementById("phone");
    const orgInput = document.getElementById("organization");
    const emailInput = document.getElementById("email");

    fioInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^А-Яа-яЁё\s\-]/g, "");
    });

    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9\+\s\-\(\)]/g, "");
    });

    phoneInput.addEventListener("blur", function () {
        const digits = this.value.replace(/\D/g, "");
        if (digits.length > 0 && digits.length < 10) {
            this.setCustomValidity("Телефон должен содержать минимум 10 цифр");
            this.reportValidity();
        } else {
            this.setCustomValidity("");
        }
    });

    orgInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^А-Яа-яЁёA-Za-z0-9\s\-\.,\x22]/g, "");
    });

    emailInput.addEventListener("input", function () {
        this.value = this.value.replace(/\s/g, "");
    });

    // --- 2. Управление попапом и History API ---
    function openPopup() {
        popup.classList.add("active");
        history.pushState({ popup: true }, "", "#form");
        restoreFormData();
    }

    function closePopup(fromHistory = false) {
        popup.classList.remove("active");
        if (!fromHistory && history.state && history.state.popup) {
            history.back();
        }
    }

    openBtn.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", () => closePopup(false));

    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.popup) {
            popup.classList.add("active");
            restoreFormData();
        } else {
            popup.classList.remove("active");
        }
    });

    popup.addEventListener("click", function (e) {
        if (e.target === popup) {
            closePopup(false);
        }
    });

    // --- 3. LocalStorage ---
    function saveFormData() {
        const data = {
            fio: fioInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            organization: orgInput.value,
            message: document.getElementById("message").value,
            agree: document.getElementById("agree").checked
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function restoreFormData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                fioInput.value = data.fio || "";
                emailInput.value = data.email || "";
                phoneInput.value = data.phone || "";
                orgInput.value = data.organization || "";
                document.getElementById("message").value = data.message || "";
                document.getElementById("agree").checked = data.agree || false;
            } catch (e) {
                console.error("Ошибка восстановления данных", e);
            }
        }
    }

    function clearFormData() {
        localStorage.removeItem(STORAGE_KEY);
        form.reset();
    }

    let saveTimeout;
    form.addEventListener("input", function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveFormData, 500);
    });

    // --- 4. Отправка формы через fetch ---
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";
        statusDiv.textContent = "";
        statusDiv.className = "form-status";

        fetch(FORMCARRY_ENDPOINT, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw err; });
            }
        })
        .then(data => {
            statusDiv.textContent = "Спасибо! Ваше сообщение отправлено.";
            statusDiv.classList.add("success");
            clearFormData();
        })
        .catch(error => {
            console.error("Ошибка отправки:", error);
            statusDiv.textContent = "Ошибка при отправке. Попробуйте позже.";
            statusDiv.classList.add("error");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Отправить";
        });
    });

    // --- 5. Инициализация ---
    if (window.location.hash === "#form") {
        popup.classList.add("active");
        restoreFormData();
        history.replaceState({ popup: true }, "", "#form");
    } else {
        history.replaceState({ popup: false }, "", window.location.pathname);
    }
});