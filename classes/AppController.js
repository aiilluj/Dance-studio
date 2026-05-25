class AppController {
    constructor() {
        this.DIRECTIONS_DATA = DIRECTIONS_DATA_RAW.map(d =>
            new DanceDirection(d.id, d.name, d.category, d.label, d.description, d.price, d.image)
        );

        this.TRAINERS_DATA = TRAINERS_DATA_RAW;
        this.favoritesManager = new FavoritesManager();
        this.themeManager     = new ThemeManager();
        this.formValidator    = new FormValidator("contactForm");

        this.currentFilter = "all";
        this.currentSearch = "";

        this.directionsGrid = document.getElementById("directionsGrid");
        this.trainersGrid   = document.getElementById("trainersGrid");
        this.searchInput    = document.getElementById("searchInput");
        this.favCountSpan   = document.getElementById("favCount");
        this.favPanel       = document.getElementById("favPanel");
        this.favOverlay     = document.getElementById("favOverlay");
        this.favList        = document.getElementById("favList");
        this.favFooter      = document.getElementById("favFooter");
        this.favPanelCount  = document.getElementById("favPanelCount");
        this.mobileMenu     = document.getElementById("mobileMenu");

        this.init();
    }

    init() {
        this.renderDirections();
        this.renderTrainers();
        this.populateDirectionSelect();
        this.updateFavoritesUI();
        this.bindEvents();
    }

    // ─────────────────────────────────────────────
    //  Обработчики событий
    // ─────────────────────────────────────────────

    bindEvents() {
        document.getElementById("themeToggle")
            .addEventListener("click", () => this.themeManager.toggleTheme());

        window.addEventListener("scroll", () => this.handleScroll());

        document.getElementById("menuBtn")
            .addEventListener("click", () => this.toggleMobileMenu());

        this.searchInput.addEventListener("input", (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.renderDirections();
        });

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-btn")
                    .forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                this.currentFilter = e.target.dataset.filter;
                this.renderDirections();
            });
        });

        document.getElementById("favBtn")
            .addEventListener("click", () => this.toggleFavPanel(true));
        document.getElementById("closeFavPanel")
            .addEventListener("click", () => this.toggleFavPanel(false));
        this.favOverlay
            .addEventListener("click", () => this.toggleFavPanel(false));
        document.getElementById("favBookingBtn")
            .addEventListener("click", () => {
                this.toggleFavPanel(false);
                this.scrollToSection("contacts");
            });

        document.querySelectorAll("[data-nav]").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = e.target.dataset.nav;
                this.scrollToSection(targetId);
                this.mobileMenu.style.display = "none";
            });
        });

        document.getElementById("logoLink")
            .addEventListener("click", (e) => {
                e.preventDefault();
                this.scrollToSection("hero");
            });

        document.getElementById("contactForm")
            .addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    handleScroll() {
        const header = document.getElementById("header");
        if (window.scrollY > 10) {
            header.classList.add("header-scrolled");
            header.classList.remove("header-transparent");
        } else {
            header.classList.remove("header-scrolled");
            header.classList.add("header-transparent");
        }
        this.themeManager.updateHeaderStyles();
    }

    toggleMobileMenu() {
        this.mobileMenu.style.display =
            this.mobileMenu.style.display === "block" ? "none" : "block";
    }

    toggleFavPanel(open) {
        if (open) {
            this.favPanel.classList.add("active");
            this.favOverlay.classList.add("active");
            this.renderFavPanelList();
        } else {
            this.favPanel.classList.remove("active");
            this.favOverlay.classList.remove("active");
        }
    }

    scrollToSection(id) {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    // ─────────────────────────────────────────────
    //  Управление избранным
    // ─────────────────────────────────────────────

    updateFavoritesUI() {
        const count = this.favoritesManager.count;
        this.favCountSpan.style.display = count > 0 ? "flex" : "none";
        this.favCountSpan.textContent = count;
        this.favPanelCount.textContent = count > 0 ? `(${count})` : "";
    }

    handleFavToggle(id) {
        this.favoritesManager.toggle(id);
        this.updateFavoritesUI();
        this.renderDirections();
        this.renderFavPanelList();
    }

    // ─────────────────────────────────────────────
    //  Сброс фильтров
    // ─────────────────────────────────────────────

    resetFilters() {
        this.currentFilter = "all";
        this.currentSearch = "";
        this.searchInput.value = "";
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === "all");
        });
        this.renderDirections();
    }

    // ─────────────────────────────────────────────
    //  Рендеринг
    // ─────────────────────────────────────────────

    renderDirections() {
        let filtered = this.DIRECTIONS_DATA.filter(d =>
            this.currentFilter === "all" || d.category === this.currentFilter
        );

        if (this.currentSearch) {
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(this.currentSearch) ||
                d.description.toLowerCase().includes(this.currentSearch)
            );
        }

        if (filtered.length === 0) {
            this.directionsGrid.innerHTML = `
                <div class="no-results">
                    <p>По запросу ничего не найдено</p>
                    <button id="resetFiltersBtn" class="no-results-btn">Сбросить фильтры</button>
                </div>`;
            document.getElementById("resetFiltersBtn")
                .addEventListener("click", () => this.resetFilters());
            return;
        }

        this.directionsGrid.innerHTML = filtered.map(d => {
            const isFav = this.favoritesManager.isFavorite(d.id);
            return `
                <div class="direction-card">
                    <div class="card-img-wrapper">
                        <img class="card-img" src="${d.image}" alt="${d.name}">
                        <span class="card-badge">${d.label}</span>
                        <button class="card-fav-btn ${isFav ? "active" : ""}"
                                data-id="${d.id}"
                                aria-label="Добавить в избранное">
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                 fill="${isFav ? "currentColor" : "none"}"
                                 stroke="currentColor" stroke-width="2">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-body">
                        <h3>${d.name}</h3>
                        <p class="description">${d.description}</p>
                        <div class="card-footer">
                            <span class="card-price">${d.price} / занятие</span>
                            <button class="card-action-btn" data-go-contact="true">Записаться</button>
                        </div>
                    </div>
                </div>`;
        }).join("");

        this.directionsGrid.querySelectorAll(".card-fav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.handleFavToggle(id);
            });
        });

        this.directionsGrid.querySelectorAll("[data-go-contact]").forEach(btn => {
            btn.addEventListener("click", () => this.scrollToSection("contacts"));
        });
    }

    renderTrainers() {
        this.trainersGrid.innerHTML = this.TRAINERS_DATA.map(t => `
            <div class="trainer-card">
                <div class="trainer-img-wrapper">
                    <img src="${t.image}" alt="${t.name}">
                </div>
                <div class="card-body">
                    <h3>${t.name}</h3>
                    <p class="trainer-role">${t.role}</p>
                    <p class="trainer-bio">${t.bio}</p>
                    <span class="trainer-exp">${t.experience}</span>
                </div>
            </div>`
        ).join("");
    }

    renderFavPanelList() {
        const favIds = this.favoritesManager.items;
        const favItemsData = this.DIRECTIONS_DATA.filter(d => favIds.includes(d.id));

        if (favItemsData.length === 0) {
            this.favList.innerHTML = `
                <div class="fav-empty-state">
                    <p>Пока ничего не добавлено</p>
                    <span>Нажмите ♡ на карточке направления</span>
                </div>`;
            this.favFooter.style.display = "none";
            return;
        }

        this.favList.innerHTML = favItemsData.map(d => `
            <div class="fav-item">
                <img src="${d.image}" alt="${d.name}" class="fav-item-img">
                <div class="fav-item-info">
                    <h4>${d.name}</h4>
                    <p class="meta">${d.label}</p>
                    <p class="price">${d.price}</p>
                </div>
                <button class="fav-item-remove" data-id="${d.id}" aria-label="Удалить">✕</button>
            </div>`
        ).join("");

        this.favList.querySelectorAll(".fav-item-remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                this.handleFavToggle(id);
            });
        });

        this.favFooter.style.display = "block";
    }

    populateDirectionSelect() {
        const select = document.getElementById("formDirection");
        select.innerHTML = '<option value="">Не выбрано</option>' +
            this.DIRECTIONS_DATA
                .map(d => `<option value="${d.name}">${d.name}</option>`)
                .join("");
    }

    // ─────────────────────────────────────────────
    //  Форма
    // ─────────────────────────────────────────────

    handleFormSubmit(e) {
        e.preventDefault();

        if (this.formValidator.checkAll()) {
            const name      = document.getElementById("formName").value.trim();
            const phone     = document.getElementById("formPhone").value.trim();
            const direction = document.getElementById("formDirection").value;

            const request = {
                id: Date.now(),
                name,
                phone,
                direction: direction || "Не выбрано",
                date: new Date().toLocaleString("ru-RU")
            };

            const existing = JSON.parse(localStorage.getItem("trial_requests") || "[]");
            existing.push(request);
            localStorage.setItem("trial_requests", JSON.stringify(existing));

            alert(`Спасибо, ${name}! Ваша заявка успешно создана. Мы свяжемся с вами в ближайшее время.`);
            this.formValidator.clearForm();
        }
    }
}