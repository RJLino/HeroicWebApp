let express = require('express');
let router = express.Router();
const gameService = require('./../gameService.js');
const gameId = "a225ea55-3e78-47a3-8cbd-b45236a69578";
const Error = require('./../model/Error.js');

/* GET pirates game. */
router.get('/', function(req, res, next) {
    gameService.getGame(gameId,(err, game) => {
        res.render('game', game)
    })
});

router.get('/store', function(req, res, next) {
    gameService.getResources(gameId,(err, resources) => {
        gameService.getBasicPlayer(gameId, 1, (err, player) => {
            resources.player = player;
            res.render('store', {Resources : resources})
        });
    })
});

router.get('/profile/:playerId', function(req, res, next) {
    gameService.getPlayer(gameId, req.params.playerId,(err, player) => {
        res.render('profile', player)
    })
});

router.post('/ContributeGroupChallenge', function(req, res, next) {
    gameService.contributeGroupChallenge(gameId, req.body.playerId, req.body.groupChallengeId, (errMessage, response) =>{
        if(errMessage)
            next(new Error(response.statusCode, response.body));
        else{
            res.redirect('back')
        }
    })
});

router.post('/CompleteChallenge', function(req, res, next) {
    gameService.completeChallenge(gameId, req.body.playerId, req.body.challengeId, (errMessage, response) =>{
        if(errMessage)
            next(new Error(response.statusCode, response.body));
        else{
            res.redirect('back')
        }
    })
});

router.post('/EquipResource', function(req, res, next) {
    gameService.equipResource(gameId, req.body.playerId, req.body.resourceId, (errMessage, response) =>{
        if(errMessage)
            next(new Error(response.statusCode, response.body));
        else{
            res.redirect('back')
        }
    })
});

router.post('/UnequipResource', function(req, res, next) {
    gameService.unequipResource(gameId, req.body.playerId, req.body.resourceId, (errMessage, response) =>{
        if(errMessage)
            next(new Error(response.statusCode, response.body));
        else{
            res.redirect('back')
        }
    })
});

router.post('/store/PurchaseResource', function(req, res, next) {
    gameService.purchaseResource(gameId, req.body.playerId, req.body.resourceId, req.body.currencyId, (errMessage, response) =>{
        if(errMessage)
            next(new Error(response.statusCode, response.body));
        else{
            res.redirect('back')
        }
    })
});

module.exports = router;