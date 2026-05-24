class FavoritesManager {
    constructor() {
        this.storageKey = "danceFavorites";
        this.favorites = this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    }

    toggle(id) {
        const index = this.favorites.indexOf(id);
        if (index === -1) {
            this.favorites.push(id);
        } else {
            this.favorites.splice(index, 1);
        }
        this.saveToLocalStorage();
        return this.isFavorite(id);
    }

    isFavorite(id) {
        return this.favorites.includes(id);
    }

    get count() {
        return this.favorites.length;
    }

    get items() {
        return this.favorites;
    }
}