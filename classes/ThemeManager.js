class ThemeManager {
    constructor() {
        this.storageKey = "appTheme";
        this.currentTheme = localStorage.getItem(this.storageKey) || "light";
        this.init();
    }

    init() {
        this.applyTheme();
    }

    applyTheme() {
        const root = document.documentElement;
        const themeToggle = document.getElementById("themeToggle");

        if (this.currentTheme === "dark") {
            root.classList.add("dark");
            if (themeToggle) {
                themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
            }
        } else {
            root.classList.remove("dark");
            if (themeToggle) {
                themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
            }
        }
        this.updateHeaderStyles();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        localStorage.setItem(this.storageKey, this.currentTheme);
        this.applyTheme();
    }

    updateHeaderStyles() {
        const scrolled = window.scrollY > 10;
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {
            if (link.closest("#mobileMenu")) return;

            if (scrolled || this.currentTheme === "dark") {
                link.classList.remove("nav-link-transparent");
                link.classList.add("nav-link-scrolled");
            } else {
                link.classList.add("nav-link-transparent");
                link.classList.remove("nav-link-scrolled");
            }
        });
    }
}