var LoopBackContext = require('loopback-context')

exports.checkAuth = function(req, res){
  var ctx = LoopBackContext.getCurrentContext();
  var currentUser = ctx && ctx.get('currentUser');

  if(!currentUser){
    console.log(currentUser)
    res.status(401).json({
      error:{
        msg: '请先登录'
      }
    })
    return false;
  }

  return true;
}
