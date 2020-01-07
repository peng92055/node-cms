// Generated on 2015-01-02 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// use this if you want to recursively match all subfolders:

var _ = require('lodash')

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var appConfig = {
    client_path: 'client/app',
    dist: 'dist'
  }

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    appConfig: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': [
            '<%= appConfig.client_path %>/modules/**/*.js',
            '<%= appConfig.client_path %>/modules/**/**/*.js',
            '<%= appConfig.client_path %>/modules/*/views/*.html',
            '<%= appConfig.client_path %>/modules/*/views/**/*.html'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'loopbackApp'
        },
        files: {
          '<%= appConfig.client_path %>/js/translations.js': ['po/*.po']
        }
      }
    },
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep:server']
      },
      js: {
        files: [
          '!<%= appConfig.client_path %>/modules/**/tests/**',
          '<%= appConfig.client_path %>/modules/**/{,*/}*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= appConfig.client_path %>/css/{,*/}*.css'],
        tasks: [
          'newer:copy:styles',
          'autoprefixer'
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.client_path %>/{,*/}*.html',
          '<%= appConfig.client_path %>/**/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '<%= appConfig.client_path %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      includeSource: {
        files: ['<%= appConfig.client_path %>/index.tpl.html'],
        tasks: ['includeSource:server']
      }
    },

    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
        dest: '<%= appConfig.client_path %>/js/config.js'
      },
      build: {
        constants: {
          ENV: {
            name: 'development',
            apiUrl: '<%= appConfig.url %><%= appConfig.restApiRoot %>',
            siteUrl: '<%= appConfig.url %>',
            mUrl: '<%= appConfig.m_url%>',
            pcUrl: '<%= appConfig.pc_url%>',
            storeServer: '<%= appConfig.store_server%>',
            imageServer: '<%= appConfig.image_server%>'
          }
        }
      }
    },


    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '127.0.0.1' to access the server from outside.
        hostname: '127.0.0.1',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.client_path)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.client_path %>/modules/**/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '{,*/}*.css',
          dest: '.tmp/css/'
        }]
      }

    },
    includeSource: {
      options: {
        basePath: 'client/app',
        baseUrl: '/',
        templates: {
          html: {
            js: '<script src="{filePath}"></script>',
            css: '<link rel="stylesheet" href="{filePath}" />'
          }
        }
      },
      server: {
        files: {
          '<%= appConfig.client_path %>/index.html': '<%= appConfig.client_path %>/index.tpl.html'
        }
      },
      dist: {
        files: {
          '<%= appConfig.dist %>/index.html': '<%= appConfig.client_path %>/index.tpl.html'
        }
      }

    },
    // Automatically inject Bower components into the app
    wiredep: {
      server: {
        src: ['<%= appConfig.client_path %>/index.html'],
        ignorePath: /\.\.\//
      },
      dist: {
        src: ['<%= appConfig.dist %>/index.html'],
        ignorePath: '../client/app/'
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/scripts/{,*/}*.js',
          '<%= appConfig.dist %>/styles/{,*/}*.css'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.dist %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        root: '<%= appConfig.client_path %>',
        flow: {
          html: {
            steps: {
              js: [
                'concat',
                'uglifyjs'
              ],
              css: [
                'cssmin'
              ]
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= appConfig.dist %>',
          '<%= appConfig.dist %>/images'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= appConfig.dist %>/css/main.css': [
    //         '.tmp/css/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= appConfig.dist %>/scripts/scripts.js': [
    //         '<%= appConfig.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.client_path %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.client_path %>/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: [
            '*.html',
            'modules/**/views/{,*/}*.html'
          ],
          dest: '<%= appConfig.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: [
            '*.js',
            '!lb-services.js',
            '!config.js',
            '!oldieshim.js'
          ],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.client_path %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'modules/**/{,*/}*.html',
            'images/{,*/}*.*',
            //'css/{,*/}*.*',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '<%= appConfig.client_path %>/images',
          dest: '<%= appConfig.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= appConfig.client_path %>/css',
          dest: '<%= appConfig.dist %>/css',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= appConfig.client_path %>/bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>'
        }, {
          expand: true,
          cwd: '<%= appConfig.client_path %>/bower_components/ionicons',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>'
        }, {
          expand: true,
          cwd: '<%= appConfig.client_path %>/bower_components/font-awesome',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.client_path %>/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    loopback_sdk_angular: {
      build: {
        options: {
          input: 'server/server.js',
          output: '<%= appConfig.client_path %>/js/lb-services.js',
          apiUrl: '<%= appConfig.url %><%= appConfig.restApiRoot %>'
        }
      },
    },

    "jsbeautifier": {
      "default": {
        src: [
          "client/app/js/app.js",
          "client/app/modules/**/*.js",
          "common/**/*.js",
          "server/**/*.js"
        ],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      "git-pre-commit": {
        src: ["src/**/*.js"],
        options: {
          mode: "VERIFY_ONLY"
        }
      }
    }

  });

  // Load the plugin that provides the "loopback-angular" and "grunt-docular" tasks.

  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'api',
      'includeSource:server',
      'ngconstant',
      'loopback_sdk_angular',
      'wiredep:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  var nodemon = require('gulp-nodemon');

  grunt.registerTask('api', function() {
    nodemon({
      script: 'server/server.js',
      ext: 'js json',
      watch: [
        'common',
        'server'
      ]
    })
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('format', [
    'jsbeautifier:default'
  ]);

  grunt.registerTask('config', 'update configuration for different env', function(target) {
    if(target){
      var appConfig = require('./server/config.' + target + '.json')
    }else{
      var appConfig = require('./server/config.local.json')
    }
    grunt.config.set('appConfig', appConfig)
  })


  grunt.registerTask('build', 'Build the project', function(target) {
    if (target === 'production') {
      return grunt.task.run([
        'config:production',
        'clean:dist',
        'ngconstant',
        'loopback_sdk_angular',
        'includeSource:dist',
        'wiredep:dist',
        'useminPrepare',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
      ]);
    } else if (target === 'test') {
      return grunt.task.run([
        'config:test',
        'clean:dist',
        'ngconstant',
        'loopback_sdk_angular',
        'includeSource',
        'wiredep:dist',
        'useminPrepare',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
      ]);
    }

    grunt.task.run([
      'config',
      'clean:server',
      'includeSource:server',
      'ngconstant',
      'loopback_sdk_angular',
      'wiredep:server',
      'concurrent:server',
      'autoprefixer'
    ])
  });

  //for product use
  grunt.registerTask('default', [
    'build'
  ]);


  grunt.registerTask('gettext', [
    'nggettext_extract',
    'nggettext_compile',
  ]);

  grunt.registerTask('includesource', [
    'includeSource:server'
  ]);

};
