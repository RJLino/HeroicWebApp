'use strict';

/**
 * Constructor GroupChallenge
 */
class GroupChallenge {
    constructor(id, name, description, repeatable, completed, requiredAchievements, requiredAttributes, requiredChallenges, achievementLoot, resourceLoot, currencyLoot) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.repeatable = repeatable;
        this.completed = completed;
        this.requiredAchievements = requiredAchievements;
        this.requiredAttributes = requiredAttributes;
        this.requiredChallenges = requiredChallenges;
        this.achievementLoot = achievementLoot;
        this.resourceLoot = resourceLoot;
        this.currencyLoot = currencyLoot;
    }
}

module.exports = GroupChallenge;