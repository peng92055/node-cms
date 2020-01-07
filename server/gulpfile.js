'use strict'

var gulp = require('gulp');
var del = require('del');
var addStream = require('add-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename')
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var watch = require('gulp-watch');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var fs = require('fs');
var _ = require('lodash');


var scripts = require('./app.scripts.json');
var cssJson = require('./app.css.json');

var appConfig = getAppConfig(getTaskInfo(), './client/')
var dist_path = appConfig.buildConfig.dist;

var source = {
    js: {
      main: 'client/main.js',
      src: [
        // application bootstrap file
        'client/main.js',

        // application config
        'client/modules/app.config.js',

        // main module
        'client/modules/app.js',

        // module files
        'client/modules/**/*module.js',

        // other js files [controllers, services, etc.]
        'client/modules/**/!(module)*.js'
      ],
      tpl: 'client/modules/**/*.tpl.html'
    },
    page: 'client/**/*.html'
  };

var destinations = {
  js: 'client/vendor',
  css: 'client/assets/css'
};

//打包vendor js 和 vendor css
gulp.task('experience:vendor', function() {
  _.forIn(scripts.chunks, function(chunkScripts, chunkName) {
    var paths = [];
    chunkScripts.forEach(function(script) {
      var scriptFileName = scripts.paths[script];

      if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

        throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
      }
      paths.push(scriptFileName);
    });
    gulp.src(paths)
      .pipe(concat(chunkName + '.js'))
      //.on('error', swallowError)
      .pipe(gulp.dest(destinations.js))
  })

  _.forIn(cssJson.chunks, function(chunkCss, chunkName) {
    var paths = [];
    chunkCss.forEach(function(css) {
      var cssFileName = cssJson.paths[css];

      if (!fs.existsSync(__dirname + '/' + cssFileName)) {

        throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + cssFileName, css)
      }
      paths.push(cssFileName);
    });
    gulp.src(paths)
      .pipe(concat(chunkName + '.css'))
      //.on('error', swallowError)
      .pipe(gulp.dest(destinations.css))
  })

});

//根据环境，生成Angular Constant参数
gulp.task('experience:constants', function() {
  return ngConstant({
      name: 'exe.experience.config',
      constants: {
        APP_CONFIG: appConfig.ngConfig
      },
      stream: true,
      wrap: '"use strict";\n\n <%= __ngModule %>',
    })
    .pipe(rename('appConfig.js'))
    .pipe(gulp.dest('client/modules'));
})

gulp.task('experience:watch', function() {
  gulp.watch(source.js.src, ['experience:js']);
  gulp.watch(source.js.tpl, ['experience:js']);
  watch([destinations.js, source.page]).pipe(connect.reload());
});

//JS合并
gulp.task('experience:js', ['experience:constants'], function() {
  return gulp.src(source.js.src)
    .pipe(addStream.obj(getTemplateStream()))
    .pipe(concat('exe.experience.js'))
    .pipe(gulp.dest(destinations.js));
});

//清理目标文件夹
gulp.task('experience:clean', function(cb) {
  del([dist_path], {
    force: true
  }).then(function() {
    cb()
  })
})

//更新文件版本
gulp.task('experience:usemin', ['experience:js'], function() {
  return gulp.src(['client/index.html'], { base: './client/' })
    .pipe(usemin({
      path: './client',
      outputRelativePath: '.',
      css: [cssmin, rev],
      js: [uglify, rev],
      rev: [rev]
    }))
    .pipe(gulp.dest(dist_path));
});

//Copy图片资源
gulp.task('experience:dist_assets', function() {
  // var dist_path = 'dist/' + taskInfo.app + "/" + taskInfo.env
  return gulp.src([
      'client/assets/**/*',
      '!client/assets/css/*'
    ], { base: './client' })
    .pipe(gulp.dest(dist_path))
});

//dev
gulp.task('dev', ['experience:vendor', 'experience:js', 'experience:watch']);

gulp.task('build:vendor', ['experience:vendor']);
gulp.task('build:vendor:test', ['experience:vendor']);
gulp.task('build:vendor:production', ['experience:vendor']);


//build
gulp.task('experience:build', ['experience:dist_assets', 'experience:vendor'], function() {
  gulp.start('experience:usemin')
});

//call from cmd line
gulp.task('build:experience:dev', ['experience:clean'], function() {
  gulp.start('experience:build')
})
gulp.task('build:experience:test', ['experience:clean'], function() {
  gulp.start('experience:build')
})
gulp.task('build:experience:production', ['experience:clean'], function() {
  gulp.start('experience:build')
})

var getTemplateStream = function() {
  return gulp.src(source.js.tpl)
    .pipe(templateCache({
      root: 'modules/',
      module: 'exe.experience'
    }))
};

function getTaskInfo(){
  var tasks = process.argv[2].split(':')

  var taskInfo = {
    name: tasks[0] || 'dev',
    app: tasks[1],
    env: tasks[2] || 'dev'
  }

  return taskInfo
}

function getAppConfig(taskInfo, path) {
  var config = require(path + 'config.js')[taskInfo.env] || {};
  if (taskInfo.name == 'dev' || taskInfo.env == 'dev') {
    var localConfig = require(path + 'config.local.js')[taskInfo.name]
    config = _.merge(config, localConfig)
  }
  return config
}