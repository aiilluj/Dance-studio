/**
 * FormValidator.js — валидация формы записи на занятие.
 * Проверяет имя и телефон, отображает ошибки и сбрасывает форму.
 */
class FormValidator {
    // ─── Инициализация ────────────────────────────────────────────────────

    constructor(formId) {
        // Кэшируем DOM-элементы один раз, чтобы не искать их повторно
        this.form       = document.getElementById(formId);
        this.nameInput  = document.getElementById("formName");
        this.phoneInput = document.getElementById("formPhone");
        this.nameError  = document.getElementById("nameError");
        this.phoneError = document.getElementById("phoneError");
    }

    // ─── Правила валидации ────────────────────────────────────────────────

    /** Возвращает сообщение об ошибке для имени или пустую строку, если имя корректно. */
    validateName(name) {
        if (!name)                               return "Введите имя";
        if (!/^[а-яА-Яa-zA-Z\s\-]+$/.test(name)) return "Имя должно содержать только буквы";
        return "";
    }

    /** Возвращает сообщение об ошибке для телефона или пустую строку, если телефон корректен. */
    validatePhone(phone) {
        if (!phone) return "Введите телефон";

        const digitCount = phone.replace(/\D/g, "").length;
        if (digitCount < 10) return "Телефон должен содержать не менее 10 цифр";
        return "";
    }

    // ─── Работа с ошибками ────────────────────────────────────────────────

    /** Показывает сообщение об ошибке под полем и добавляет класс ошибки. */
    showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        inputElement.classList.add("error");
    }

    /** Скрывает все сообщения об ошибках и снимает классы ошибок с полей. */
    clearErrors() {
        this.nameError.textContent  = "";
        this.phoneError.textContent = "";
        this.nameInput.classList.remove("error");
        this.phoneInput.classList.remove("error");
    }

    // ─── Публичный интерфейс ──────────────────────────────────────────────

    /**
     * Валидирует все поля формы.
     * Возвращает true, если форма заполнена корректно.
     */
    validateAll() {
        this.clearErrors();
        let isValid = true;

        const nameErrorMessage = this.validateName(this.nameInput.value.trim());
        if (nameErrorMessage) {
            this.showError(this.nameInput, this.nameError, nameErrorMessage);
            isValid = false;
        }

        const phoneErrorMessage = this.validatePhone(this.phoneInput.value.trim());
        if (phoneErrorMessage) {
            this.showError(this.phoneInput, this.phoneError, phoneErrorMessage);
            isValid = false;
        }

        return isValid;
    }

    /** Сбрасывает значения полей формы и очищает ошибки. */
    resetForm() {
        this.form.reset();
        this.clearErrors();
    }
}