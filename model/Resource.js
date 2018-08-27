'use strict';

/**
 * Constructor Resource
 */
class Resource {
    constructor(id, name, description, prices, modifiers, equipped) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.prices = prices;
        this.modifiers = modifiers;
        this.equipped = equipped;
    }
}

module.exports = Resource;