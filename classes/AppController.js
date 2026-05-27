/**
 * AppController.js — главный контроллер приложения.
 *
 * Порядок внутри класса:
 *   1. constructor — объявление полей и кэширование DOM
 *   2. init       — инициализация: первичный рендер и навешивание событий
 *   3. bindEvents — все обработчики событий
 *   4. Методы обработки конкретных событий (handle*)
 *   5. Методы рендеринга (render*)
 *   6. Вспомогательные методы
 */
class AppController {
    // ─── Инициализация ────────────────────────────────────────────────────

    constructor() {
        // Данные
        this.directions = DIRECTIONS_DATA_RAW.map(
            raw => new DanceDirection(
                raw.id, raw.name, raw.category,
                raw.label, raw.description, raw.price, raw.image
            )
        );
        this.trainers = TRAINERS_DATA_RAW;

        // Менеджеры
        this.favoritesManager = new FavoritesManager();
        this.themeManager     = new ThemeManager();
        this.formValidator    = new FormValidator("contactForm");

        // Состояние фильтрации
        this.activeFilter = "all";
        this.searchQuery  = "";

        // Кэш DOM-элементов 
        this.directionsGrid = document.getElementById("directionsGrid");
        this.trainersGrid   = document.getElementById("trainersGrid");
        this.searchInput    = document.getElementById("searchInput");
        this.favCountBadge  = document.getElementById("favCount");
        this.favPanel       = document.getElementById("favPanel");
        this.favOverlay     = document.getElementById("favOverlay");
        this.favList        = document.getElementById("favList");
        this.favFooter      = document.getElementById("favFooter");
        this.favPanelCount  = document.getElementById("favPanelCount");
        this.mobileMenu     = document.getElementById("mobileMenu");
        this.header         = document.getElementById("header");

        this.init();
    }

    /** Выполняет первичный рендер и регистрирует все обработчики. */
    init() {
        this.renderDirections();
        this.renderTrainers();
        this.fillDirectionSelect();
        this.refreshFavoritesUI();
        this.bindEvents();
    }

    // ─── Привязка событий ─────────────────────────────────────────────────

    /** Регистрирует все обработчики событий приложения. */
    bindEvents() {
        this.bindThemeToggle();
        this.bindScrollHandler();
        this.bindMobileMenu();
        this.bindSearch();
        this.bindFilterButtons();
        this.bindFavPanel();
        this.bindNavLinks();
        this.bindForm();
    }

    /** Переключение темы. */
    bindThemeToggle() {
        document.getElementById("themeToggle")
            .addEventListener("click", () => this.themeManager.toggleTheme());
    }

    /** Обновление шапки и стилей навигации при прокрутке. */
    bindScrollHandler() {
        window.addEventListener("scroll", () => this.handleScroll());
    }

    /** Открытие / закрытие мобильного меню. */
    bindMobileMenu() {
        document.getElementById("menuBtn")
            .addEventListener("click", () => this.toggleMobileMenu());
    }

    /** Поиск по направлениям. */
    bindSearch() {
        this.searchInput.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderDirections();
        });
    }

    /** Фильтрация по категории. */
    bindFilterButtons() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => this.handleFilterChange(e.target));
        });
    }

    /** Панель избранного: открытие, закрытие, кнопка записи. */
    bindFavPanel() {
        document.getElementById("favBtn")
            .addEventListener("click", () => this.openFavPanel());

        document.getElementById("closeFavPanel")
            .addEventListener("click", () => this.closeFavPanel());

        this.favOverlay
            .addEventListener("click", () => this.closeFavPanel());

        document.getElementById("favBookingBtn")
            .addEventListener("click", () => {
                this.closeFavPanel();
                this.scrollToSection("contacts");
            });
    }

    /** Навигационные ссылки (шапка и мобильное меню). */
    bindNavLinks() {
        document.getElementById("logoLink")
            .addEventListener("click", (e) => {
                e.preventDefault();
                this.scrollToSection("hero");
            });

        document.querySelectorAll("[data-nav]").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.scrollToSection(e.target.dataset.nav);
                this.mobileMenu.style.display = "none";
            });
        });
    }

    /** Отправка формы записи. */
    bindForm() {
        document.getElementById("contactForm")
            .addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // ─── Обработчики событий ──────────────────────────────────────────────

    /** Обновляет классы шапки при прокрутке страницы. */
    handleScroll() {
        const isScrolled = window.scrollY > 10;
        this.header.classList.toggle("header-scrolled",     isScrolled);
        this.header.classList.toggle("header-transparent", !isScrolled);
        this.themeManager.updateNavLinkStyles();
    }

    /** Применяет выбранный фильтр категории к списку направлений. */
    handleFilterChange(clickedButton) {
        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));
        clickedButton.classList.add("active");
        this.activeFilter = clickedButton.dataset.filter;
        this.renderDirections();
    }

    /** Переключает состояние избранного для направления с заданным id. */
    handleFavoriteToggle(id) {
        this.favoritesManager.toggleFavorite(id);
        this.refreshFavoritesUI();
        this.renderDirections();
        this.renderFavPanelList();
    }

    /** Валидирует форму и сохраняет заявку в localStorage при успехе. */
    handleFormSubmit(e) {
        e.preventDefault();
        if (!this.formValidator.validateAll()) return;

        const request = this.buildFormRequest();
        this.saveFormRequest(request);
        alert(`Спасибо, ${request.name}! Ваша заявка успешно создана. Мы свяжемся с вами в ближайшее время.`);
        this.formValidator.resetForm();
    }

    // ─── Рендеринг ────────────────────────────────────────────────────────

    /** Отрисовывает карточки направлений с учётом фильтра и поискового запроса. */
    renderDirections() {
        const filtered = this.getFilteredDirections();

        if (filtered.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.directionsGrid.innerHTML = filtered
            .map(direction => this.buildDirectionCardHTML(direction))
            .join("");

        this.bindDirectionCardEvents();
    }

    /** Отрисовывает карточки преподавателей. */
    renderTrainers() {
        this.trainersGrid.innerHTML = this.trainers
            .map(trainer => this.buildTrainerCardHTML(trainer))
            .join("");
    }

    /** Отрисовывает список избранных направлений в боковой панели. */
    renderFavPanelList() {
        const favoritedDirections = this.directions.filter(
            direction => this.favoritesManager.isFavorite(direction.id)
        );

        if (favoritedDirections.length === 0) {
            this.renderFavEmptyState();
            return;
        }

        this.favList.innerHTML = favoritedDirections
            .map(direction => this.buildFavItemHTML(direction))
            .join("");

        this.bindFavItemRemoveEvents();
        this.favFooter.style.display = "block";
    }

    // ─── Построители HTML ─────────────────────────────────────────────────

    /** Возвращает HTML-строку карточки направления. */
    buildDirectionCardHTML(direction) {
        const isFavorite = this.favoritesManager.isFavorite(direction.id);
        const heartFill  = isFavorite ? "currentColor" : "none";

        return `
            <div class="direction-card">
                <div class="card-img-wrapper">
                    <img class="card-img" src="${direction.image}" alt="${direction.name}">
                    <span class="card-badge">${direction.label}</span>
                    <button class="card-fav-btn ${isFavorite ? "active" : ""}"
                            data-id="${direction.id}"
                            aria-label="Добавить в избранное">
                        <svg width="18" height="18" viewBox="0 0 24 24"
                             fill="${heartFill}" stroke="currentColor" stroke-width="2">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    </button>
                </div>
                <div class="card-body">
                    <h3>${direction.name}</h3>
                    <p class="description">${direction.description}</p>
                    <div class="card-footer">
                        <span class="card-price">${direction.price} / занятие</span>
                        <button class="card-action-btn" data-go-contact="true">Записаться</button>
                    </div>
                </div>
            </div>`;
    }

    /** Возвращает HTML-строку карточки преподавателя. */
    buildTrainerCardHTML(trainer) {
        return `
            <div class="trainer-card">
                <div class="trainer-img-wrapper">
                    <img src="${trainer.image}" alt="${trainer.name}">
                </div>
                <div class="card-body">
                    <h3>${trainer.name}</h3>
                    <p class="trainer-role">${trainer.role}</p>
                    <p class="trainer-bio">${trainer.bio}</p>
                    <span class="trainer-exp">${trainer.experience}</span>
                </div>
            </div>`;
    }

    /** Возвращает HTML-строку элемента избранного в боковой панели. */
    buildFavItemHTML(direction) {
        return `
            <div class="fav-item">
                <img src="${direction.image}" alt="${direction.name}" class="fav-item-img">
                <div class="fav-item-info">
                    <h4>${direction.name}</h4>
                    <p class="meta">${direction.label}</p>
                    <p class="price">${direction.price}</p>
                </div>
                <button class="fav-item-remove" data-id="${direction.id}" aria-label="Удалить">✕</button>
            </div>`;
    }

    /** Отрисовывает заглушку при отсутствии результатов поиска/фильтрации. */
    renderEmptyState() {
        this.directionsGrid.innerHTML = `
            <div class="no-results">
                <p>По запросу ничего не найдено</p>
                <button id="resetFiltersBtn" class="no-results-btn">Сбросить фильтры</button>
            </div>`;

        document.getElementById("resetFiltersBtn")
            .addEventListener("click", () => this.resetFilters());
    }

    /** Отрисовывает заглушку при пустом списке избранного. */
    renderFavEmptyState() {
        this.favList.innerHTML = `
            <div class="fav-empty-state">
                <p>Пока ничего не добавлено</p>
                <span>Нажмите ♡ на карточке направления</span>
            </div>`;
        this.favFooter.style.display = "none";
    }

    // ─── Привязка событий к динамическим элементам ────────────────────────

    /** Вешает события на кнопки «в избранное» и «Записаться» в сетке направлений. */
    bindDirectionCardEvents() {
        this.directionsGrid.querySelectorAll(".card-fav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.dataset.id, 10);
                this.handleFavoriteToggle(id);
            });
        });

        this.directionsGrid.querySelectorAll("[data-go-contact]").forEach(btn => {
            btn.addEventListener("click", () => this.scrollToSection("contacts"));
        });
    }

    /** Вешает события на кнопки удаления из избранного в боковой панели. */
    bindFavItemRemoveEvents() {
        this.favList.querySelectorAll(".fav-item-remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id, 10);
                this.handleFavoriteToggle(id);
            });
        });
    }

    // ─── Управление панелью избранного ───────────────────────────────────

    /** Открывает боковую панель избранного. */
    openFavPanel() {
        this.favPanel.classList.add("active");
        this.favOverlay.classList.add("active");
        this.renderFavPanelList();
    }

    /** Закрывает боковую панель избранного. */
    closeFavPanel() {
        this.favPanel.classList.remove("active");
        this.favOverlay.classList.remove("active");
    }

    // ─── Вспомогательные методы ───────────────────────────────────────────

    /** Возвращает массив направлений, отфильтрованных по категории и поисковому запросу. */
    getFilteredDirections() {
        return this.directions.filter(direction => {
            const matchesCategory = this.activeFilter === "all"
                || direction.category === this.activeFilter;

            const matchesSearch = !this.searchQuery
                || direction.name.toLowerCase().includes(this.searchQuery)
                || direction.description.toLowerCase().includes(this.searchQuery);

            return matchesCategory && matchesSearch;
        });
    }

    /** Сбрасывает фильтр и поисковый запрос к начальным значениям. */
    resetFilters() {
        this.activeFilter    = "all";
        this.searchQuery     = "";
        this.searchInput.value = "";

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === "all");
        });

        this.renderDirections();
    }

    /** Обновляет счётчик избранного в шапке и заголовке панели. */
    refreshFavoritesUI() {
        const count = this.favoritesManager.count;
        this.favCountBadge.style.display = count > 0 ? "flex" : "none";
        this.favCountBadge.textContent   = count;
        this.favPanelCount.textContent   = count > 0 ? `(${count})` : "";
    }

    /** Заполняет выпадающий список направлений в форме записи. */
    fillDirectionSelect() {
        const select = document.getElementById("formDirection");
        select.innerHTML = '<option value="">Не выбрано</option>'
            + this.directions
                .map(d => `<option value="${d.name}">${d.name}</option>`)
                .join("");
    }

    /** Плавно прокручивает страницу к секции с заданным id. */
    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    /** Переключает видимость мобильного меню. */
    toggleMobileMenu() {
        const isVisible = this.mobileMenu.style.display === "block";
        this.mobileMenu.style.display = isVisible ? "none" : "block";
    }

    /** Собирает данные заявки из полей формы. */
    buildFormRequest() {
        return {
            id:        Date.now(),
            name:      document.getElementById("formName").value.trim(),
            phone:     document.getElementById("formPhone").value.trim(),
            direction: document.getElementById("formDirection").value || "Не выбрано",
            date:      new Date().toLocaleString("ru-RU"),
        };
    }

    /** Добавляет заявку к существующим в localStorage. */
    saveFormRequest(request) {
        const storageKey      = "trial_requests";
        const existingRequests = JSON.parse(localStorage.getItem(storageKey) || "[]");
        existingRequests.push(request);
        localStorage.setItem(storageKey, JSON.stringify(existingRequests));
    }
}