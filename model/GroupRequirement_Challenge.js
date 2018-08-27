'use strict';

/**
 * Constructor GroupRequirement_Challenge
 */
class GroupRequirement_Challenge {
    constructor(challengeId, challengeDesignation, currentValue, targetValue) {
        this.challengeId = challengeId;
        this.challengeDesignation = challengeDesignation;
        this.currentValue = currentValue;
        this.targetValue = targetValue;
    }
}

module.exports = GroupRequirement_Challenge;