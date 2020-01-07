var loopback = require('loopback')
var LoopBackContext = require('loopback-context')
var _ = require('lodash')

module.exports = function(app) {
  app.use(LoopBackContext.perRequest());
  app.use(loopback.token({
    model: app.models.accessToken
  }));

  app.use(function setCurrentUser(req, res, next) {
    if (!req.accessToken) {
      return next();
    }
    app.models.User.findById(req.accessToken.userId, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      var loopbackContext = LoopBackContext.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('currentUser', user);
      }
      next();
    });

    // app.models.Role.getRoles({principalType: app.models.RoleMapping.USER, principalId: req.accessToken.userId}, function(err, roles) {
    //     console.log(roles);  // everyone, authenticated, etc (hopefully)
    //   _.each(roles, function(role){
    //     console.log(role);
    //   })
    // });
  });
}
