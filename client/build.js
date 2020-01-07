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
var loopbackAngular = require('gulp-loopback-sdk-angular');
var Util = require('../gulp/utils')


module.exports = function(taskInfo) {

  var appConfig = Util.getAppConfig(taskInfo, '../cms/')

  console.log(appConfig)

  var source = {
    js: {
      main: 'cms/main.js',
      src: [
        // application bootstrap file
        'cms/main.js',

        // application config
        'cms/modules/app.config.js',

        // main module
        'cms/modules/app.js',

        // module files
        'cms/modules/**/*module.js',

        // other js files [controllers, services, etc.]
        'cms/modules/**/!(module)*.js',

        '!cms/modules/lb-services.js'
      ],
      tpl: 'cms/modules/**/*.tpl.html'
    },
    page: 'cms/**/*.html'
  };

  var destinations = {
    js: 'cms/build'
  };


  var dist_path = appConfig.buildConfig.dist || 'dist/' + taskInfo.app + "/" + taskInfo.env

  gulp.task('cms:lb-sdk-ng', function() {
    return gulp.src(appConfig.buildConfig.serverDir + '/server/server.js')
      .pipe(loopbackAngular({
        apiUrl: appConfig.ngConfig.apiUrl
      }))
      .pipe(rename('lb-services.js'))
      .pipe(gulp.dest('./cms/build'));
  })

  //根据环境，生成Angular Constant参数
  gulp.task('cms:constants', function() {
    return ngConstant({
        name: 'exe.cms.config',
        constants: {
          APP_CONFIG: appConfig.ngConfig
        },
        stream: true,
        wrap: '"use strict";\n\n <%= __ngModule %>',
      })
      .pipe(rename('appConfig.js'))
      .pipe(gulp.dest('cms/modules'));

  })

  //JS合并
  gulp.task('cms:js', ['cms:constants', ], function() {
    return gulp.src(source.js.src)
      .pipe(addStream.obj(getTemplateStream()))
      .pipe(concat('exe-cms.js'))
      .pipe(gulp.dest(destinations.js));
  });

  //JS打包
  gulp.task('cms:js_build', ['cms:constants', 'cms:lb-sdk-ng'], function() {
    return gulp.src(source.js.src)
      .pipe(addStream.obj(getTemplateStream()))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(concat('exe-cms.js'))
      .pipe(gulp.dest(destinations.js));
  });

  //CSS编译压缩
  gulp.task('styles', function() {

  })

  //监控文件变化，自动刷新
  gulp.task('cms:watch', function() {
    gulp.watch(source.js.src, ['cms:js']);
    gulp.watch(source.js.tpl, ['cms:js']);
    watch([destinations.js, source.page]).pipe(connect.reload());
  });

  //启动开发服务器，通过代理访问后端服务
  gulp.task('cms:connect', function() {
    connect.server({
      port: 8888,
      livereload: true,
      root: ['cms', '.'],
      middleware: function(connect, opt) {
        return [
          proxy(['/api'], {
            target: appConfig.proxy.target_server
          })
        ]
      }
    });
  });

  //清理目标文件夹
  gulp.task('cms:clean', function(cb) {
    // var clean_path = 'dist/' + taskInfo.app + "/" + taskInfo.env
    del([dist_path], {
      force: true
    }).then(function() {
      cb()
    })
  })

  //更新文件版本
  gulp.task('cms:usemin', ['build:EXEAdmin', 'cms:js_build'], function() {
    // var dist_path = 'dist/' + taskInfo.app + "/" + taskInfo.env
    return gulp.src(['cms/index.html'], { base: './cms/' })
      .pipe(usemin({
        path: './cms',
        outputRelativePath: '.',
        css: [cssmin, rev],
        js: [uglify, rev],
        rev: [rev]
      }))
      .pipe(gulp.dest(dist_path));
  });

  //Copy第三方库
  gulp.task('cms:dist_vendor', function() {
    // var dist_path = 'dist/' + taskInfo.app + "/" + taskInfo.env
    return gulp.src([
        'EXEAdmin/assets/**/*',
        '!EXEAdmin/assets/css/*'
      ], { base: './EXEAdmin' })
      .pipe(gulp.dest(dist_path))
  });

  //Copy项目代码至dist目录
  gulp.task('cms:dist', function() {
    // var dist_path = 'dist/' + taskInfo.app + "/" + taskInfo.env
    return gulp.src([
        'cms/assets/**/*',
        '!cms/assets/css/*'
      ], { base: './cms' })
      .pipe(gulp.dest(dist_path))
  });

  //dev
  gulp.task('dev:cms', ['dev:EXEAdmin', 'cms:constants', 'cms:lb-sdk-ng', 'cms:js', 'cms:watch', 'cms:connect']);

  //build
  gulp.task('cms:build', ['cms:dist_vendor', 'cms:dist', 'cms:usemin'])
    //call from cmd line
  gulp.task('build:cms:dev', ['cms:clean'], function() {
    gulp.start('cms:build')
  })
  gulp.task('build:cms:test', ['cms:clean'], function() {
    gulp.start('cms:build')
  })
  gulp.task('build:cms:production', ['cms:clean'], function() {
    gulp.start('cms:build')
  })


  var getTemplateStream = function() {
    return gulp.src(source.js.tpl)
      .pipe(templateCache({
        root: 'modules/',
        module: 'exe.cms'
      }))
  };

}