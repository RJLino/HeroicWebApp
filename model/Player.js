'use strict';

/**
 * Constructor Player
 */
class Player {
    constructor(Id, Name, Purse, Inventory, Stats, Achievements, Challenges) {
        this.Id = Id;
        this.Name = Name;
        this.Purse = Purse;
        this.Inventory = Inventory;
        this.Stats = Stats;
        this.Achievements = Achievements;
        this.Challenges = Challenges;
    }
}

module.exports = Player;