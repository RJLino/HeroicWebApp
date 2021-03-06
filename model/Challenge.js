'use strict';

/**
 * Constructor Challenge
 */
class Challenge {
    constructor(id, name, description, repeatable, completed, requiredAchievements, requiredAttributes, requiredChallenges, resourceLoot, currencyLoot) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.repeatable = repeatable;
        this.completed = completed;
        this.requiredAchievements = requiredAchievements;
        this.requiredAttributes = requiredAttributes;
        this.requiredChallenges = requiredChallenges;
        this.resourceLoot = resourceLoot;
        this.currencyLoot = currencyLoot;
    }
}

module.exports = Challenge;