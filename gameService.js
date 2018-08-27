
const http = require('http');
const request = require('request');
const Game = require('./model/Game.js');
const Achievement = require('./model/Achievement.js');
const Challenge = require('./model/Challenge.js');
const GroupChallenge = require('./model/GroupChallenge.js');
const Resource = require('./model/Resource.js');
const Attribute = require('./model/Attribute.js');
const Currency = require('./model/Currency.js');
const Player = require('./model/Player.js');

const GroupRequirement_Achievement = require('./model/GroupRequirement_Achievement.js');
const GroupRequirement_Attribute = require('./model/GroupRequirement_Attribute.js');
const GroupRequirement_Challenge = require('./model/GroupRequirement_Challenge.js');

const heroicuri = 'http://localhost:53144/';

module.exports = {
    'getGame': getGame,
    'getPlayer' : getPlayer,
    'getBasicPlayer' : getBasicPlayer,
    'getResources' : getResources,
    'contributeGroupChallenge' : contributeGroupChallenge,
    'completeChallenge' : completeChallenge,
    'equipResource' : equipResource,
    'unequipResource' : unequipResource,
    'purchaseResource' : purchaseResource
};
function getGame(gameId, cb){
    httpGetter(heroicuri + "game/" + gameId, (err, document) => {
        if(err) return cb(err);
        const gameData = JSON.parse(document.toString());
        let challenges; let achievements; let resources;

        achievements = gameData.achievements.map(obj => new Achievement(obj.id, obj.name, obj.description));

        let chIndex = 0;
        challenges = gameData.challenges.map(obj => new Challenge(obj.id, obj.name, obj.description, obj.repeatable, obj.completed));
        gameData.challenges.forEach(ch => {
            let requiredAchievements;
            let requiredAttributes ;
            let requiredChallenges;
            let achievementLoot;
            let resourceLoot;
            let currencyLoot;
            if(Array.isArray(ch.requiredAchievements) && ch.requiredAchievements.length){
                requiredAchievements = ch.requiredAchievements.map(obj => new Achievement(obj.id, obj.name, obj.description));
                challenges[chIndex].requiredAchievements = requiredAchievements;
            }
            if(Array.isArray(ch.requiredAttributes) && ch.requiredAttributes.length){
                requiredAttributes = ch.requiredAttributes.map(obj => new Attribute(obj.id, obj.designation, obj.value));
                challenges[chIndex].requiredAttributes = requiredAttributes;
            }
            if(Array.isArray(ch.requiredChallenges) && ch.requiredChallenges.length){
                requiredChallenges = ch.requiredChallenges.map(obj => new Challenge(obj.id));
                challenges[chIndex].requiredChallenges = requiredChallenges;
            }

            if(Array.isArray(ch.achievementLoot) && ch.achievementLoot.length){
                achievementLoot = ch.achievementLoot.map(obj => new Achievement(obj.id, obj.name, obj.description));
                challenges[chIndex].achievementLoot = achievementLoot;
            }
            if(Array.isArray(ch.resourceLoot) && ch.resourceLoot.length){
                resourceLoot = ch.resourceLoot.map(obj => new Resource(obj.id, obj.name, obj.description,
                    obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                    obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
                challenges[chIndex].resourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.currencyLoot) && ch.currencyLoot.length){
                currencyLoot = ch.currencyLoot.map(obj => new Currency(obj.id, obj.designation, obj.value));
                challenges[chIndex].currencyLoot = currencyLoot;
            }
            chIndex++;
        });

        if(Array.isArray(gameData.resources) && gameData.resources.length){
            resources = gameData.resources.map(obj => new Resource(obj.id, obj.name, obj.description,
                obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
        }
        getGroupChallenges(gameId, (err, groupChallenges) => {
            if (err) return cb(err);
            getPlayer(gameId, 1, (err, player)=> {
                if(err) return cb(err);
                let game = new Game(gameData.id, gameData.name, challenges, groupChallenges, achievements, resources, player);
                cb(null, game)
            });
        });
    })
}

function getPlayer(gameId, playerId, cb){
    httpGetter(heroicuri + "player/" + playerId + "/game/" + gameId, (err, document) => {
        if(err) return cb(err);
        const playerData = JSON.parse(document.toString());
        let purse;
        let inventory;
        let stats;
        let challenges;
        let achievements;

        if(Array.isArray(playerData.purse) && playerData.purse.length){
            purse = playerData.purse.map(obj => new Currency(obj.id, obj.designation, obj.value));
        }
        if(Array.isArray(playerData.inventory) && playerData.inventory.length){
            inventory = playerData.inventory.map(obj => new Resource(obj.id, obj.name, obj.description,
                obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value)), obj.equipped));
        }
        if(Array.isArray(playerData.stats) && playerData.stats.length){
            stats = playerData.stats.map(obj => new Attribute(obj.id, obj.designation, obj.value));
        }
        if(Array.isArray(playerData.achievements) && playerData.achievements.length){
            achievements = playerData.achievements.map(obj => new Achievement(obj.id, obj.name, obj.description));
        }

        let chIndex = 0;
        challenges = playerData.challenges.map(obj => new Challenge(obj.id, obj.name, obj.description, obj.repeatable, obj.completed));
        playerData.challenges.forEach(ch => {
            let requiredAchievements;
            let requiredAttributes ;
            let requiredChallenges;
            let resourceLoot;
            let currencyLoot;
            if(Array.isArray(ch.requiredAchievements) && ch.requiredAchievements.length){
                requiredAchievements = ch.requiredAchievements.map(obj => new Achievement(obj.id, obj.name, obj.description));
                challenges[chIndex].requiredAchievements = requiredAchievements;
            }
            if(Array.isArray(ch.requiredAttributes) && ch.requiredAttributes.length){
                requiredAttributes = ch.requiredAttributes.map(obj => new Attribute(obj.id, obj.designation, obj.value));
                challenges[chIndex].requiredAttributes = requiredAttributes;
            }
            if(Array.isArray(ch.requiredChallenges) && ch.requiredChallenges.length){
                requiredChallenges = ch.requiredChallenges.map(obj => new Challenge(obj.id));
                challenges[chIndex].requiredChallenges = requiredChallenges;
            }

            if(Array.isArray(ch.resourceLoot) && ch.resourceLoot.length){
                resourceLoot = ch.resourceLoot.map(obj => new Resource(obj.id, obj.name, obj.description,
                    obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                    obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
                challenges[chIndex].resourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.currencyLoot) && ch.currencyLoot.length){
                currencyLoot = ch.currencyLoot.map(obj => new Currency(obj.id, obj.designation, obj.value));
                challenges[chIndex].currencyLoot = currencyLoot;
            }
            chIndex++;
        });

        let player = new Player(playerData.userId, playerData.avatarName, purse, inventory, stats, achievements, challenges);
        cb(null, player)
    });
}

function getBasicPlayer(gameId, playerId, cb) {
    httpGetter(heroicuri + "player/" + playerId + "/game/" + gameId, (err, document) => {
        if (err) return cb(err);
        const playerData = JSON.parse(document.toString());
        let purse;
        if(Array.isArray(playerData.purse) && playerData.purse.length){
            purse = playerData.purse.map(obj => new Currency(obj.id, obj.designation, obj.value));
        }

        let player = new Player(playerData.userId, playerData.avatarName, purse);
        cb(null, player);
    });
}

function getChallenges(gameId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/challenges", (err, document) => {
        if (err) return cb(err);
        const challengeData = JSON.parse(document.toString());

        let chIndex = 0;
        let challenges = challengeData.map(obj => new Challenge(obj.id, obj.name, obj.description, obj.repeatable));
        challengeData.forEach(ch => {
            let requiredAchievements;
            let requiredAttributes ;
            let requiredChallenges;
            let achievementLoot;
            let resourceLoot;
            let currencyLoot;
            if(Array.isArray(ch.requiredAchievements) && ch.requiredAchievements.length){
                requiredAchievements = ch.requiredAchievements.map(obj => new Achievement(obj.id, obj.name, obj.description));
                challenges[chIndex].requiredAchievements = requiredAchievements;
            }
            if(Array.isArray(ch.requiredAttributes) && ch.requiredAttributes.length){
                requiredAttributes = ch.requiredAttributes.map(obj => new Attribute(obj.id, obj.designation, obj.value));
                challenges[chIndex].requiredAttributes = requiredAttributes;
            }
            if(Array.isArray(ch.requiredChallenges) && ch.requiredChallenges.length){
                requiredChallenges = ch.requiredChallenges.map(obj => new Challenge(obj.id));
                challenges[chIndex].requiredChallenges = requiredChallenges;
            }

            if(Array.isArray(ch.achievementLoot) && ch.achievementLoot.length){
                achievementLoot = ch.achievementLoot.map(obj => new Achievement(obj.id, obj.name, obj.description));
                challenges[chIndex].achievementLoot = achievementLoot;
            }
            if(Array.isArray(ch.resourceLoot) && ch.resourceLoot.length){
                resourceLoot = ch.resourceLoot.map(obj => new Resource(obj.id, obj.name, obj.description,
                    obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                    obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
                challenges[chIndex].resourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.currencyLoot) && ch.currencyLoot.length){
                currencyLoot = ch.currencyLoot.map(obj => new Currency(obj.id, obj.designation, obj.value));
                challenges[chIndex].currencyLoot = currencyLoot;
            }
            chIndex++;
        });
        cb(null,challenges)
    });
}

function getGroupChallenges(gameId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/groupchallenges", (err, document) => {
        if (err) return cb(err);
        const groupChallengeData = JSON.parse(document.toString());

        let chIndex = 0;
        let groupChallenges = groupChallengeData.map(obj => new GroupChallenge(obj.id, obj.name, obj.description, obj.repeatable, obj.completed));
        groupChallengeData.forEach(ch => {
            let requiredAchievements;
            let requiredAttributes;
            let requiredChallenges;
            let achievementLoot;
            let resourceLoot;
            let currencyLoot;

            if(Array.isArray(ch.requiredAchievements) && ch.requiredAchievements.length){
                requiredAchievements = ch.requiredAchievements.map(obj => new GroupRequirement_Achievement(obj.id, obj.designation, obj.currentValue, obj.targetValue));
                groupChallenges[chIndex].requiredAchievements = requiredAchievements;
            }
            if(Array.isArray(ch.requiredAttributes) && ch.requiredAttributes.length){
                requiredAttributes = ch.requiredAttributes.map(obj => new GroupRequirement_Attribute(obj.id, obj.designation, obj.currentValue, obj.targetValue));
                groupChallenges[chIndex].requiredAttributes = requiredAttributes;
            }
            if(Array.isArray(ch.requiredChallenges) && ch.requiredChallenges.length){
                requiredChallenges = ch.requiredChallenges.map(obj => new GroupRequirement_Challenge(obj.id, obj.designation, obj.currentValue, obj.targetValue));
                groupChallenges[chIndex].requiredChallenges = requiredChallenges;
            }

            if(Array.isArray(ch.achievementLoot) && ch.achievementLoot.length){
                achievementLoot = ch.achievementLoot.map(obj => new Achievement(obj.id, obj.name, obj.description));
                groupChallenges[chIndex].achievementLoot = achievementLoot;
            }
            if(Array.isArray(ch.resourceLoot) && ch.resourceLoot.length){
                resourceLoot = ch.resourceLoot.map(obj => new Resource(obj.id, obj.name, obj.description,
                    obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                    obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
                groupChallenges[chIndex].resourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.currencyLoot) && ch.currencyLoot.length){
                currencyLoot = ch.currencyLoot.map(obj => new Currency(obj.id, obj.designation, obj.value));
                groupChallenges[chIndex].currencyLoot = currencyLoot;
            }
            chIndex++;
        });
        cb(null,groupChallenges)
    });
}

function getResources(gameId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/resources", (err, document) => {
        if (err) return cb(err);
        let resources;
        const resourceData = JSON.parse(document.toString());

        if(Array.isArray(resourceData) && resourceData.length){
            resources = resourceData.map(obj => new Resource(obj.id, obj.name, obj.description,
                obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
        }
        cb(null, resources)
    });
}

function getAchievement(gameId, achievementId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/achievement/" + achievementId, (err, document) => {
        if (err) return cb(err);
        let achievement;
        const achievementData = JSON.parse(document.toString());

        achievement = new Achievement(achievementData.id, achievementData.name, achievementData.description);
        cb(null, achievement)
    });
}

function getAttribute(gameId, attributeId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/attribute/" + attributeId, (err, document) => {
        if (err) return cb(err);
        let attribute;
        const attributeData = JSON.parse(document.toString());

        attribute = new Attribute(attributeData.id, attributeData.designation);
        cb(null, attribute)
    });
}

function getChallenge(gameId, challengeId, cb) {
    httpGetter(heroicuri + "game/" + gameId + "/challenge/" + challengeId, (err, document) => {
        if (err) return cb(err);
        let challenge;
        let requiredAchievements;
        let requiredAttributes ;
        let requiredChallenges;
        let achievementLoot;
        let resourceLoot;
        let currencyLoot;
        const challengeData = JSON.parse(document.toString());

        challenge = new Challenge(challengeData.id, challengeData.name, challengeData.description, challengeData.repeatable);

        if(Array.isArray(challengeData.requiredAchievements) && challengeData.requiredAchievements.length){
            requiredAchievements = challengeData.requiredAchievements.map(obj => new Achievement(obj.id, obj.name, obj.description));
            challenge.requiredAchievements = requiredAchievements;
        }
        if(Array.isArray(challengeData.requiredAttributes) && challengeData.requiredAttributes.length){
            requiredAttributes = challengeData.requiredAttributes.map(obj => new Attribute(obj.id, obj.designation, obj.value));
            challenge.requiredAttributes = requiredAttributes;
        }
        if(Array.isArray(challengeData.requiredChallenges) && challengeData.requiredChallenges.length){
            requiredChallenges = challengeData.requiredChallenges.map(obj => new Challenge(obj.id));
            challenge.requiredChallenges = requiredChallenges;
        }

        if(Array.isArray(challengeData.achievementLoot) && challengeData.achievementLoot.length){
            achievementLoot = challengeData.achievementLoot.map(obj => new Achievement(obj.id, obj.name, obj.description));
            challenge.achievementLoot = achievementLoot;
        }
        if(Array.isArray(challengeData.resourceLoot) && challengeData.resourceLoot.length){
            resourceLoot = challengeData.resourceLoot.map(obj => new Resource(obj.id, obj.name, obj.description,
                obj.prices.map(obj => new Currency(obj.id, obj.designation, obj.value)),
                obj.modifiers.map(obj => new Attribute(obj.id, obj.designation, obj.value))));
            challenge.resourceLoot = resourceLoot;
        }
        if(Array.isArray(challengeData.currencyLoot) && challengeData.currencyLoot.length){
            currencyLoot = challengeData.currencyLoot.map(obj => new Currency(obj.id, obj.designation, obj.value));
            challenge.currencyLoot = currencyLoot;
        }
        cb(null, challenge)
    });
}

function contributeGroupChallenge(gameId, playerId, groupChallengeId, cb){
    let body = JSON.stringify({
        gameId : gameId,
        playerId : playerId,
        groupChallengeId : groupChallengeId
    });
    post("player/" + playerId + "/game/" + gameId + "/groupChallenge/" + groupChallengeId + "/contribute", body, (response, errMessage) =>{
        if(errMessage)
            cb(errMessage, response)
        else
            cb(null, response)
    });
}

function completeChallenge(gameId, playerId, challengeId, cb){
    let body = JSON.stringify({
                gameId : gameId,
                playerId : playerId,
                challengeId : challengeId
                });
    post("player/" + playerId + "/game/" + gameId + "/challenge/" + challengeId + "/complete", body, (response, errMessage) =>{
        if(errMessage)
            cb(errMessage, response)
        else
            cb(null, response)
    });
}

function equipResource(gameId, playerId, resourceId, cb){
    let body = JSON.stringify({
        gameId : gameId,
        playerId : playerId,
        resourceId : resourceId
    });
    post("player/" + playerId + "/game/" + gameId + "/equip/resource/" + resourceId, body, (response, errMessage) =>{
        if(errMessage)
            cb(errMessage, response)
        else
            cb(null, response)
    });
    }

function unequipResource(gameId, playerId, resourceId, cb){
    let body = JSON.stringify({
        gameId : gameId,
        playerId : playerId,
        resourceId : resourceId
    });
    post("player/" + playerId + "/game/" + gameId + "/unequip/resource/" + resourceId, body, (response, errMessage) =>{
        if(errMessage)
            cb(errMessage, response)
        else
            cb(null, response)
    });
}

function purchaseResource(gameId, playerId, resourceId, currencyId, cb){
    let body = JSON.stringify({
        gameId : gameId,
        playerId : playerId,
        resourceId : resourceId,
        currencyId: currencyId
    });
    post("player/" + playerId + "/game/" + gameId + "/purchase/" + currencyId + "/resource/" + resourceId , body, (response, errMessage) =>{
        if(errMessage)
            cb(errMessage, response)
        else
            cb(null, response)
    });
}

function post(path, body, cb){
    request.post(
        heroicuri + path,
        { json: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                cb(response)
            }
            else
                cb(response, body)
        }
    );
}

function httpGetter(path, cb){
http.get(path, (resp) => {
    let res = '';
    resp.on('error', cb);
    resp.on('data', chunk => res += chunk.toString());
    resp.on('end', () => cb(null, res))
})
}