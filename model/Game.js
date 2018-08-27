'use strict';

/**
 * Constructor Game
 */
class Game {
    constructor(id, name, challenges, groupChallenges, achievements, resources, player) {
        this.id = id;
        this.name = name;
        this.challenges = challenges;
        this.groupChallenges = groupChallenges;
        this.achievements = achievements;
        this.resources = resources;
        this.player = player;
    }
}

module.exports = Game;