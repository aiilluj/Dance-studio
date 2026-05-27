/**
 * DanceDirection.js — сущность направления танцев.
 * Хранит данные об одном направлении студии.
 */
class DanceDirection {
    constructor(id, name, category, label, description, price, image) {
        this.id          = id;
        this.name        = name;
        this.category    = category;
        this.label       = label;
        this.description = description;
        this.price       = price;
        this.image       = image;
    }
}