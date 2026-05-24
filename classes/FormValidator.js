class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.nameInput = document.getElementById("formName");
        this.phoneInput = document.getElementById("formPhone");
        this.nameError = document.getElementById("nameError");
        this.phoneError = document.getElementById("phoneError");
    }

    validateName(name) {
        if (!name) return "Введите имя";
        if (!/^[а-яА-Яa-zA-Z\s\-]+$/.test(name)) return "Имя должно содержать только буквы";
        return "";
    }

    validatePhone(phone) {
        const digits = phone.replace(/\D/g, "");
        if (!phone) return "Введите телефон";
        if (digits.length < 10) return "Телефон должен содержать не менее 10 цифр";
        return "";
    }

    clearErrors() {
        this.nameError.textContent = "";
        this.phoneError.textContent = "";
        this.nameInput.classList.remove("error");
        this.phoneInput.classList.remove("error");
    }

    showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        inputElement.classList.add("error");
    }

    clearForm() {
        this.form.reset();
        this.clearErrors();
    }

    checkAll() {
        this.clearErrors();
        let isValid = true;

        const nameValue = this.nameInput.value.trim();
        const nameErrMessage = this.validateName(nameValue);
        if (nameErrMessage) {
            this.showError(this.nameInput, this.nameError, nameErrMessage);
            isValid = false;
        }

        const phoneValue = this.phoneInput.value.trim();
        const phoneErrMessage = this.validatePhone(phoneValue);
        if (phoneErrMessage) {
            this.showError(this.phoneInput, this.phoneError, phoneErrMessage);
            isValid = false;
        }

        return isValid;
    }
}