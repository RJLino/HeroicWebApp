
const http = require('http');
const Game = require('./model/Game.js');
const Achievement = require('./model/Achievement.js');
const Challenge = require('./model/Challenge.js');
const Resource = require('./model/Resource.js');
const Attribute = require('./model/Attribute.js');
const Currency = require('./model/Currency.js');
const Player = require('./model/Player.js');

const heroicuri = 'http://localhost:52903/api/game/';

module.exports = {
    'getGame': getGame,
    'getPlayer' : getPlayer,
    'getBasicPlayer' : getBasicPlayer,
    'getResources' : getResources,
    'completeChallenge' : completeChallenge,
    'equipResource' : equipResource,
    'unequipResource' : unequipResource,
    'purchaseResource' : purchaseResource
};
function getGame(gameId, cb){
    httpGetter(heroicuri + gameId, (err, document) => {
        if(err) return cb(err);
        const gameData = JSON.parse(document.toString());

        let challenges = gameData.Challenges.map(obj => new Challenge(obj.Id, obj.Name, obj.Description, obj.Group, obj.Repeatable));
        gameData.Challenges.forEach(ch => {
            let reqAchievements;
            let reqAttributes ;
            let reqChallenges;
            let resourceLoot;
            let currencyLoot;
            if(Array.isArray(ch.ReqAchievements) && ch.ReqAchievements.length){
                reqAchievements = ch.ReqAchievements.map(obj => new Achievement(obj.Id, obj.Name, obj.Description));
                challenges[ch.Id - 1].ReqAchievements = reqAchievements;
            }
            if(Array.isArray(ch.ReqAttributes) && ch.ReqAttributes.length){
                reqAttributes = ch.ReqAttributes.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
                challenges[ch.Id - 1].ReqAttributes = reqAttributes;
            }
            if(Array.isArray(ch.ReqChallenges) && ch.ReqChallenges.length){
                reqChallenges = ch.ReqChallenges.map(obj => new Challenge(obj.Id));
                challenges[ch.Id - 1].ReqChallenges = reqChallenges;
            }

            if(Array.isArray(ch.Loot) && ch.Loot.length){
                resourceLoot = ch.Loot.map(obj => new Resource(obj.Id, obj.Name, obj.Description,
                    obj.Prices.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)),
                    obj.Modifiers.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2))));
                challenges[ch.Id - 1].ResourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.Reward) && ch.Reward.length){
                currencyLoot = ch.Reward.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
                challenges[ch.Id - 1].CurrencyLoot = currencyLoot;
            }
    });

    let achievements = gameData.Achievements.map(obj => new Achievement(obj.Id, obj.Name, obj.Description));
    let resources = [];
    for( let key in gameData.Resources){
        if(gameData.Resources.hasOwnProperty(key)) {
            resources[gameData.Resources[key].Id] = new Resource(gameData.Resources[key].Id, gameData.Resources[key].Name, gameData.Resources[key].Description,
                gameData.Resources[key].Prices.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)),
                gameData.Resources[key].Modifiers.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)));
        }
    }
    getPlayer(gameId, 1, (err, player)=> {
        if(err) return cb(err);
        let game = new Game(gameData.Id, gameData.Name, challenges, achievements, resources, player);
        cb(null, game)
    });


})
}
function getPlayer(gameId, playerId, cb){
    httpGetter(heroicuri + gameId + "/" + "player/" + playerId, (err, document) => {
        if(err) return cb(err);
        const playerData = JSON.parse(document.toString());
        let purse;
        let inventory;
        let stats;
        let challenges;
        let achievements;

        if(Array.isArray(playerData.Purse) && playerData.Purse.length){
            purse = playerData.Purse.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
        }
        if(Array.isArray(playerData.Inventory) && playerData.Inventory.length){
            inventory = playerData.Inventory.map(obj => new Resource(obj.Id, obj.Name, obj.Description,
                obj.Prices.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)),
                obj.Modifiers.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)), obj.Equipped));
        }
        if(Array.isArray(playerData.Stats) && playerData.Stats.length){
            stats = playerData.Stats.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
        }

        challenges = playerData.Challenges.map(obj => new Challenge(obj.Id, obj.Name, obj.Description, obj.Group, obj.Repeatable, obj.Completed));
        playerData.Challenges.forEach(ch => {
            let reqAchievements;
            let reqAttributes ;
            let reqChallenges;
            let resourceLoot;
            let currencyLoot;
            if(Array.isArray(ch.ReqAchievements) && ch.ReqAchievements.length){
                reqAchievements = ch.ReqAchievements.map(obj => new Achievement(obj.Id, obj.Name, obj.Description));
                challenges[ch.Id - 1].ReqAchievements = reqAchievements;
            }
            if(Array.isArray(ch.ReqAttributes) && ch.ReqAttributes.length){
                reqAttributes = ch.ReqAttributes.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
                challenges[ch.Id - 1].ReqAttributes = reqAttributes;
            }
            if(Array.isArray(ch.ReqChallenges) && ch.ReqChallenges.length){
                reqChallenges = ch.ReqChallenges.map(obj => new Challenge(obj.Id));
                challenges[ch.Id - 1].ReqChallenges = reqChallenges;
            }

            if(Array.isArray(ch.Loot) && ch.Loot.length){
                resourceLoot = ch.Loot.map(obj => new Resource(obj.Id, obj.Name, obj.Description,
                    obj.Prices.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)),
                    obj.Modifiers.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2))));
                challenges[ch.Id - 1].ResourceLoot = resourceLoot;
            }
            if(Array.isArray(ch.Reward) && ch.Reward.length){
                currencyLoot = ch.Reward.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
                challenges[ch.Id - 1].CurrencyLoot = currencyLoot;
            }
        });

        if(Array.isArray(playerData.Achievements) && playerData.Achievements.length){
            achievements = playerData.Achievements.map(obj => new Achievement(obj.Id, obj.Name, obj.Description));
        }

        let player = new Player(playerData.UserId, playerData.AvatarName, purse, inventory, stats, achievements, challenges);
        cb(null, player)
    });
}
function getBasicPlayer(gameId, playerId, cb) {
    httpGetter(heroicuri + gameId + "/" + "player/" + playerId, (err, document) => {
        if (err) return cb(err);
        const playerData = JSON.parse(document.toString());
        let purse;
        if(Array.isArray(playerData.Purse) && playerData.Purse.length){
            purse = playerData.Purse.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2));
        }

        let player = new Player(playerData.UserId, playerData.AvatarName, purse);
        cb(null, player);
    });
}
function getResources(gameId, cb) {
    httpGetter(heroicuri + gameId + "/resources", (err, document) => {
        if (err) return cb(err);
        let resources = [];
        const resourceData = JSON.parse(document.toString());

        for (let key in resourceData) {
            if (resourceData.hasOwnProperty(key)) {
                resources[resourceData[key].Id] = new Resource(resourceData[key].Id, resourceData[key].Name, resourceData[key].Description,
                    resourceData[key].Prices.map(obj => new Currency(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)),
                    resourceData[key].Modifiers.map(obj => new Attribute(obj.m_Item1.Id, obj.m_Item1.Designation, obj.m_Item2)));
            }
        }
        cb(null, resources)
    });
}

function completeChallenge(gameId, playerId, challengeId, cb){
    let body = JSON.stringify({
                gameId : "gameId",
                playerId : "playerId",
                challengeId : "challengeId"
                });
    postData("/api/game/" + gameId + "/player/" + playerId + "/complete/challenge/" + challengeId, body, (response) =>{
        if(response.statusCode != 202)
            cb(response);
        else
            cb(null, response)
    });
}
function equipResource(gameId, playerId, resourceId, cb){
    let body = JSON.stringify({
        gameId : "gameId",
        playerId : "playerId",
        resourceId : "resourceId"
    });
    postData("/api/game/" + gameId + "/player/" + playerId + "/equip/resource/" + resourceId, body, (response) =>{
        if(response.statusCode != 202)
            cb(response);
        else
            cb(null, response)
    });
    }
function unequipResource(gameId, playerId, resourceId, cb){
    let body = JSON.stringify({
        gameId : "gameId",
        playerId : "playerId",
        resourceId : "resourceId"
    });
    postData("/api/game/" + gameId + "/player/" + playerId + "/unequip/resource/" + resourceId, body, (response) =>{
        if(response.statusCode != 202)
            cb(response);
        else
            cb(null, response)
    });
}
function purchaseResource(gameId, playerId, resourceId, currencyId, cb){
    let body = JSON.stringify({
        gameId : "gameId",
        playerId : "playerId",
        resourceId : "resourceId",
        currencyId: "currencyId"
    });
    postData("/api/game/" + gameId + "/player/" + playerId + "/purchase/resource/" + resourceId + "/currency/" + currencyId , body, (response) =>{
        if(response.statusCode != 202)
            cb(response);
        else
            cb(null, response)
    });
}


function postData(path, body, cb){
    let request = new http.ClientRequest({
        hostname: "localhost",
        port: 52903,
        path: path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
        }
    }, (response) => {
        cb(response)
    });
    request.end(body)
}

    function httpGetter(path, cb){
    http.get(path, (resp) => {
        let res = '';
        resp.on('error', cb);
        resp.on('data', chunk => res += chunk.toString());
        resp.on('end', () => cb(null, res))
    })
}