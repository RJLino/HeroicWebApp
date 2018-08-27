'use strict';

/**
 * Constructor GroupRequirement_Achievement
 */
class GroupRequirement_Achievement {
    constructor(achievementId, achievementDesignation, currentValue, targetValue) {
        this.achievementId = achievementId;
        this.achievementDesignation = achievementDesignation;
        this.currentValue = currentValue;
        this.targetValue = targetValue;
    }
}

module.exports = GroupRequirement_Achievement;