'use strict';
var request = require('request')
var app = require("../../server")

var storeAuth = require("./auth")

var URL_Marketing = app.get("store_server") + '/rest/api/marketing'

exports.loadAll = function(req, res) {

  var url = URL_Marketing + '?limit='+req.query.limit + '&page=' + req.query.page;

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
            msg: '调用商城服务器获取marketing数据失败！'
          }
        })
        return;
      }
      if (body.error) {
        res.status(200).json({
          error: {
            msg: '调用商城服务器获取marketing数据失败！'
          }
        })
      } else {
        var result = {}
        result.data = body.marketings
        result.total = body.total
        result.page = req.query.page
        result.limit = req.query.limit
        res.status(200).json(result)
      }
    })
  })
}

exports.upsert = function(req, res) {
  var method = req.method;
  if (method == 'PUT') {
    updateMarketing(req, res)
  } else if (method == 'POST') {
    createMarketing(req, res)
  }
}

function createMarketing(req, res) {
  storeAuth.auth().then(function(jar) {
    request.post({
      url: URL_Marketing,
      jar: jar,
      json: true,
      body: req.body
    }, function(err, response, body) {
      if (err) {
        console.log(err)
      }
      res.status(200).json(body)
    })
  })
}

function updateMarketing(req, res) {
  storeAuth.auth().then(function(jar) {
    var marketing_id = req.query.marketing_id
    var url = URL_Marketing + '/' + marketing_id
    request.put({
      url: url,
      jar: jar,
      json: true,
      body: req.body
    }, function(err, response, body) {
      if (err) {
        console.log(err)
      }
      res.status(200).json(body)
    })
  })
}

exports.create = function(req, res) {

  var query = req.query();

  storeAuth.auth().then(function(jar) {

  })
}

exports.update = function(req, res) {

}
