'use strict';
var request = require('request')
var app = require("../../server")

var marketing = require('./marketing')
var game = require('./game.js')

module.exports = function(app) {

  var router = app.loopback.Router();

  router.get('/api/store/marketings', marketing.loadAll)
  router.post('/api/store/marketings', marketing.upsert)
  router.put('/api/store/marketings', marketing.upsert)


  router.get('/api/store/games/event', game.getGameEventData)

  app.use(router);

};
