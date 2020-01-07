var path = require('path');
var bodyParser  = require('body-parser');

module.exports = function(app) {

  app.enableAuth();
  
  var loopback = app.loopback;

  // // Should be placed before express.static
  // app.use(loopback.compress({
  //   // only compress files for the following content types
  //   filter: function(req, res) {
  //     return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  //   },
  //   // zlib option for compression level
  //   level: 3
  // }));

  // app.use(loopback.static(path.resolve('./public')));

  // Request body parsing middleware should be above methodOverride

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  
  app.use(bodyParser.json({limit: '50mb'}));
  // app.use(loopback.methodOverride());

  // CookieParser should be above session
  app.use(require('cookie-parser')());

  // connect flash for flash messages
  // app.use(flash());

  // // define the templating engine
  // app.engine('html', consolidate.swig);
  // app.set('view engine', 'html');

  // // set the folder where templates can be found
  // app.set('views', __dirname + '/../views');

};
