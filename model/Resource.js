'use strict';

/**
 * Constructor Resource
 */
class Resource {
    constructor(Id, Name, Description, Prices, Modifiers, Equipped) {
        this.Id = Id;
        this.Name = Name;
        this.Description = Description;
        this.Prices = Prices;
        this.Modifiers = Modifiers;
        this.Equipped = Equipped;
    }
}

module.exports = Resource;