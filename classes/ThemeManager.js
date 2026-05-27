/**
 * ThemeManager.js — управление темой оформления (светлая / тёмная).
 * Сохраняет выбор пользователя в localStorage и применяет тему при загрузке.
 */
class ThemeManager {
    // ─── Инициализация ────────────────────────────────────────────────────

    constructor() {
        this.storageKey    = "appTheme";
        this.currentTheme  = localStorage.getItem(this.storageKey) || "light";
        this.toggleButton  = document.getElementById("themeToggle");

        this.applyTheme();
    }

    // ─── Применение темы ──────────────────────────────────────────────────

    /** Применяет текущую тему к документу и обновляет иконку кнопки. */
    applyTheme() {
        const isDark = this.currentTheme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        this.updateToggleIcon(isDark);
        this.updateNavLinkStyles();
    }

    /** Переключает иконку кнопки в зависимости от активной темы. */
    updateToggleIcon(isDark) {
        if (!this.toggleButton) return;

        this.toggleButton.innerHTML = isDark
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
               </svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <circle cx="12" cy="12" r="4"/>
                   <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
               </svg>`;
    }

    // ─── Переключение темы ────────────────────────────────────────────────

    /** Переключает тему между светлой и тёмной, сохраняет в localStorage. */
    toggleTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        localStorage.setItem(this.storageKey, this.currentTheme);
        this.applyTheme();
    }

    // ─── Стили навигации ──────────────────────────────────────────────────

    /**
     * Обновляет классы ссылок навигации в зависимости от прокрутки и темы.
     * Ссылки внутри мобильного меню не затрагиваются.
     */
    updateNavLinkStyles() {
        const isScrolled     = window.scrollY > 10;
        const useScrollStyle = isScrolled || this.currentTheme === "dark";

        document.querySelectorAll(".nav-link").forEach(link => {
            if (link.closest("#mobileMenu")) return;

            link.classList.toggle("nav-link-transparent", !useScrollStyle);
            link.classList.toggle("nav-link-scrolled",    useScrollStyle);
        });
    }
}