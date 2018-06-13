'use strict';

/**
 * Constructor Challenge
 */
class Challenge {
    constructor(Id, Name, Description, Group, Repeatable, Completed, ReqAchievements, ReqAttributes, ReqChallenges, ResourceLoot, CurrencyLoot) {
        this.Id = Id;
        this.Name = Name;
        this.Description = Description;
        this.Group = Group;
        this.Repeatable = Repeatable;
        this.Completed = Completed;
        this.ReqAchievements = ReqAchievements;
        this.ReqAttributes = ReqAttributes;
        this.ReqChallenges = ReqChallenges;
        this.ResourceLoot = ResourceLoot;
        this.CurrencyLoot = CurrencyLoot;
    }
}

module.exports = Challenge;