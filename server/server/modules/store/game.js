'use strict';
var request = require('request')
var app = require("../../server")
var url = require('url')

var storeAuth = require("./auth")

var URL_GAME = app.get("store_server") + '/api/game'

exports.getGameEventData = function(req, res) {
  console.log(req.query)
  var campaign = req.query.campaign;

  var url = URL_GAME + '/getEventData?campaign=' + req.query.campaign;
  if (req.query.start) {
    url += "&start=" + req.query.start
  }
  if (req.query.end) {
    url += "&end=" + req.query.end
  }

  storeAuth.auth().then(function(jar) {
    request.get({
      url: url,
      jar: jar,
      json: true
    }, function(err, response, body) {
      if (err) {
        console.log(err)
        res.status(200).json({
          error: {
            msg: '调用游戏时间数据失败！'
          }
        })
        return;
      }
      if (body.error) {
        console.log(err)
        res.status(200).json({
          error: {
            msg: '调用游戏时间数据失败！'
          }
        })
      } else {
        res.status(200).json(body)
      }
    })
  })
}
