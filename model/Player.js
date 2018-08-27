'use strict';

/**
 * Constructor Player
 */
class Player {
    constructor(userId, avatarName, purse, inventory, stats, achievements, challenges) {
        this.userId = userId;
        this.avatarName = avatarName;
        this.purse = purse;
        this.inventory = inventory;
        this.stats = stats;
        this.achievements = achievements;
        this.challenges = challenges;
    }
}

module.exports = Player;