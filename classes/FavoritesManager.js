/**
 * FavoritesManager.js — управление избранными направлениями.
 * Отвечает за хранение, загрузку и переключение избранного через localStorage.
 */
class FavoritesManager {
    // ─── Инициализация ────────────────────────────────────────────────────

    constructor() {
        this.storageKey     = "danceFavorites";
        this.favoriteIds    = this.loadFromStorage();
    }

    // ─── Работа с хранилищем ──────────────────────────────────────────────

    /** Загружает список id избранного из localStorage. */
    loadFromStorage() {
        const savedData = localStorage.getItem(this.storageKey);
        return savedData ? JSON.parse(savedData) : [];
    }

    /** Сохраняет текущий список id избранного в localStorage. */
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favoriteIds));
    }

    // ─── Управление избранным ─────────────────────────────────────────────

    /** Добавляет id в избранное, если его нет; удаляет, если есть. */
    toggleFavorite(id) {
        const existingIndex = this.favoriteIds.indexOf(id);
        if (existingIndex === -1) {
            this.favoriteIds.push(id);
        } else {
            this.favoriteIds.splice(existingIndex, 1);
        }
        this.saveToStorage();
        return this.isFavorite(id);
    }

    /** Проверяет, находится ли направление с данным id в избранном. */
    isFavorite(id) {
        return this.favoriteIds.includes(id);
    }

    // ─── Геттеры ──────────────────────────────────────────────────────────

    /** Возвращает количество элементов в избранном. */
    get count() {
        return this.favoriteIds.length;
    }

    /** Возвращает массив id избранных направлений. */
    get items() {
        return this.favoriteIds;
    }
}