'use strict';

var request = require("request")
var app = require("../../server")
var auth = require("../../core/auth")

var STORE_M_MARKETING_PAGES_API = app.get("web_system_api") + "/m/marketing/pages"
var STORE_PC_MARKETING_PAGES_API = app.get("web_system_api") + "/pc/marketing/pages"

module.exports = function(app) {

  var router = app.loopback.Router();

  router.post('/api/marketingPages/publish', publish)
  router.post('/api/marketingPages/delete', deletes)
  router.post('/api/marketingPages/batchpublish', batchPublish)

  app.use(router);

};

function dataCheck(pageId, url) {
  if (!pageId) {
    console.log('缺少page id');
    return false;
  }
  if (!url) {
    console.log('page type 未知！！');
    return false;
  } else {
    return true;
  }
}

function getURL(type, status) {
  if (type == 'm') {
    return STORE_M_MARKETING_PAGES_API + "/" + status;
  } else if (type == 'pc') {
    return STORE_PC_MARKETING_PAGES_API + "/" + status;
  }
}

function requestPost(url, pageId, callback) {
  request.post({
    url: url,
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
      "cookie": 'xin=jing' //TODO: delete cookie when use new test env
    },
    form: { "page_id": pageId },
  }, callback);
}

function publish(req, res) {
  if (auth.checkAuth(req, res)) {
    var page_id = req.body.page_id;
    var type = req.body.type;
    var url = getURL(type, 'publish');
    if (dataCheck(page_id, url)) {
      requestPost(url, page_id, function(error, response, data) {
        var result = {};
        if (!error && response.statusCode == 200) {
          result['publish'] = true;
        } else {
          result['publish'] = false;
        }
        res.end(JSON.stringify(result))
      });
    };
  }
}

function batchPublish(req, res) {
  if (auth.checkAuth(req, res)) {
    var allPromiseArr = [];
    for (var i = 0; i < req.body.pagesArr.length; i++) {
      var page_id = req.body.pagesArr[i].page_id;
      var type = req.body.pagesArr[i].type;
      var url = getURL(type, 'publish');
      if (dataCheck(page_id, url)) {
        var itemPromise = new Promise(function(resolve, reject) {
          requestPost(url, page_id, function(error, response, data) {
            var result = {};
            if (!error && response.statusCode == 200) {
              result['publish'] = true;
              resolve(result);
            } else {
              result['publish'] = false;
              reject(result);
            }
          })
        });
        allPromiseArr.push(itemPromise);
      }
    }
    if (allPromiseArr.length != 0) {
      Promise.all(allPromiseArr).then(function(result) {
        res.end(JSON.stringify(result));
      })
    }
  }
}

function deletes(req, res) {
  if (auth.checkAuth(req, res)) {
    var page_id = req.body.page_id;
    var type = req.body.type;
    var url = getURL(type, 'delete');
    if (dataCheck(page_id, url)) {
      requestPost(url, page_id, function(error, response, data) {
        var result = {};
        if (!error && response.statusCode == 200) {
          result['delete'] = true;
        } else {
          result['delete'] = false;
        }
        res.end(JSON.stringify(result))
      })
    };
  }
}
