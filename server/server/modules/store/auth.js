var app = require("../../server")
var request = require('request')
var Q = require("q")

var STORE_URL = app.get("store_server")

var STORE_API_LOGIN = STORE_URL + "/index.php?route=api/login"

const COOKIE_TIMEOUT = 3600000
const COOKIE_NAME = 'PHPSESSID'

var store_auth = app.get("store_auth")

var sessionInfo = null

exports.auth = function() {
  var deferred = Q.defer()
  if (sessionInfo && Date.now() - sessionInfo.deadline < COOKIE_TIMEOUT) {
    deferred.resolve(sessionInfo.jar)
  } else {
    sessionInfo = {}
    sessionInfo.jar = request.jar()
    request = request.defaults({jar:sessionInfo.jar})
    request.post({
        url: STORE_API_LOGIN,
        form: store_auth,
        json: true
      },
      function(err, httpResponse, body) {
        if(err){
          console.log(err)
          deferred.reject("Error when login to freecart")
        }
        if (httpResponse && httpResponse.statusCode == 200) {
          console.log("login susseed!")
          sessionInfo.cookie = body.cookie
          sessionInfo.deadline = Date.now()
          console.log(sessionInfo)
          deferred.resolve(sessionInfo.jar)
        }
      })
  }

  return deferred.promise
}
