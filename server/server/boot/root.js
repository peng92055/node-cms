var qiniu = require('qiniu');

module.exports = function(app) {

  require('../libs/qiniu/qiniu')(app)
  require('../modules/store')(app)
  require('../modules/marketing/index')(app)
  require('../modules/experience/index')(app)

  // Install a `/` route that returns app status
  var router = app.loopback.Router();
  router.get('/status', app.loopback.status());


  router.get('/store/auth', function(req, res){
    var storeAuth = require('../modules/store/auth.js')

    storeAuth.auth().then(function(result){
      res.json(result);
    })
  })

  app.use(router);
};

