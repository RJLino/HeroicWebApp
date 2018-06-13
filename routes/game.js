let express = require('express');
let router = express.Router();
const gameService = require('./../gameService.js');
const gameId = "edd8602d-bf62-4fd4-8b98-fa8c797488df";
const Error = require('./../model/Error.js');

/* GET vikings game. */
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

router.post('/CompleteChallenge', function(req, res, next) {
    gameService.completeChallenge(gameId, req.body.playerId, req.body.challengeId, (err, data) =>{
        if(err)
            next(new Error(err.statusCode, err.statusMessage));
        else{
            res.redirect('back')
        }
    })
});

router.post('/EquipResource', function(req, res, next) {
    gameService.equipResource(gameId, req.body.playerId, req.body.resourceId, (err, data) =>{
        if(err)
            next(new Error(err.statusCode, err.statusMessage));
        else{
            res.redirect('back')
        }
    })
});

router.post('/UnequipResource', function(req, res, next) {
    gameService.unequipResource(gameId, req.body.playerId, req.body.resourceId, (err, data) =>{
        if(err)
            next(new Error(err.statusCode, err.statusMessage));
        else{
            res.redirect('back')
        }
    })
});

router.post('/store/PurchaseResource', function(req, res, next) {
    gameService.purchaseResource(gameId, req.body.playerId, req.body.resourceId, req.body.currencyId, (err, data) =>{
        if(err)
            next(new Error(err.statusCode, err.statusMessage));
        else{
            res.redirect('back')
        }
    })
});

module.exports = router;