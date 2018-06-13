'use strict';

/**
 * Constructor Game
 */
class Game {
    constructor(Id, Name, Challenges, Achievements, Resources, Player) {
        this.Id = Id;
        this.Name = Name;
        this.Challenges = Challenges;
        this.Achievements = Achievements;
        this.Resources = Resources;
        this.Player = Player;
    }
}

module.exports = Game;