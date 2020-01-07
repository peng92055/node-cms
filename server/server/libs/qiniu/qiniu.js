var qiniu = require('qiniu')
var LoopBackContext = require('loopback-context')
var bucketName = 'jingfree'

module.exports = function(app) {

  var qiniuConfig = app.get("qiniu")

  qiniu.conf.ACCESS_KEY = qiniuConfig.AK;
  qiniu.conf.SECRET_KEY = qiniuConfig.SK;

  var router = app.loopback.Router();

  router.get('/upload/uptoken', updateUptoken)

  app.use(router);

};

function updateUptoken(req, res){
  var app = require("../../server")
  var ctx = LoopBackContext.getCurrentContext();
  var currentUser = ctx && ctx.get('currentUser');

  // if(!currentUser){
  //   res.status(401).json({
  //     msg: '请先登录'
  //   })
  // }

  var putPolicy = new qiniu.rs.PutPolicy(bucketName);
  putPolicy.deadline = Date.now() + 3600000;
  res.end(JSON.stringify({
    'uptoken': putPolicy.token(),
    'deadline': putPolicy.deadline
  }))
}