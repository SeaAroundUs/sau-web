// Generated on 2015-01-26 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  var apiHost = grunt.option('apihost') || 'localhost';
  var apiHostPort = grunt.option('apihostport');
  if (!apiHostPort) {
    apiHostPort = apiHost + ':8000';
  }

  // get current commit
  var buildNumber = '';
  grunt.util.spawn({
    cmd: 'git',
    args: ['log', '-n', '1', '--no-color'],
  }, function done(error, result) {
    grunt.config.data.ngconstant.dev.constants.SAU_CONFIG.buildNumber = result.stdout;
    grunt.config.data.ngconstant.qa.constants.SAU_CONFIG.buildNumber = result.stdout;
    grunt.config.data.ngconstant.stage.constants.SAU_CONFIG.buildNumber = result.stdout;
    grunt.config.data.ngconstant.prod.constants.SAU_CONFIG.buildNumber = result.stdout;
  });

  // Define the configuration for all the tasks
  grunt.initConfig({

    ngconstant: {
      options: {
        deps: false,
        dest: '.tmp/scripts/config.js',
        name: 'sauWebApp'
      },
      dev: {
        constants: {
          SAU_CONFIG: {
            apiURL: 'http://' + apiHostPort + '/api/v1/',
            authURL: 'http://' + apiHostPort + '/account/',
            buildNumber: buildNumber,
            env: 'dev'
          }
        }
      },
      qa: {
        constants: {
          SAU_CONFIG: {
            apiURL: 'http://api.qa1.seaaroundus.org/api/v1/',
            authURL: 'http://api.qa1.seaaroundus.org/account/',
            buildNumber: buildNumber,
            env: 'qa'
          }
        }
      },
      stage: {
        constants: {
          SAU_CONFIG: {
            apiURL: 'http://api.staging.seaaroundus.org/api/v1/',
            authURL: 'http://api.staging.seaaroundus.org/account/',
            buildNumber: buildNumber,
            env: 'stage'
          }
        }
      },
      prod: {
        constants: {
          SAU_CONFIG: {
            apiURL: 'http://api.seaaroundus.org/api/v1/',
            authURL: 'http://api.seaaroundus.org/account/',
            buildNumber: buildNumber,
            env: 'prod'
          }
        }
      }
    },
    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'jscs'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {

        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
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
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    jscs: {
        src: [
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ],
        options: {
            config: '.jscsrc',
            requireCurlyBraces: [ 'if' ],
            disallowMixedSpacesAndTabs: true,
            disallowMultipleLineBreaks: true,
            disallowMultipleSpaces: true,
            disallowTrailingWhitespace: true,
            validateIndentation: 2,
            validateLineBreaks: 'LF'
        }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
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
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          // '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    // thanks to olsn @ https://github.com/yeoman/generator-angular/issues/665 for the
    // bootstrap font path fix
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images'],
        patterns: {
          css: [
            [/(\.\.\/bower_components\/bootstrap\-sass\-official\/assets\/fonts\/bootstrap)/g, 'god help me', function(match) {
              var result = match.replace('../bower_components/bootstrap-sass-official/assets/fonts/bootstrap', '../fonts');
              return result;
            }]
          ]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= yeoman.dist %>/images'
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
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
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
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt,topojson}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            'views/rfmo/**'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        },{
          expand: true,
          cwd: 'bower_components/angular-ui-grid/',
          src: ['ui-grid.ttf', 'ui-grid.woff'],
          dest: '<%= yeoman.dist %>/styles'
        },
         {
          expand: true,
          cwd: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/',
          src: '*',
          dest: '<%= yeoman.dist %>/fonts'
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/',
          src: '*',
          dest: '<%= yeoman.dist %>/fonts'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome/fonts/',
          src: '*',
          dest: '<%= yeoman.dist %>/fonts'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/reference_images/',
          src: '*',
          dest: '<%= yeoman.dist %>/reference_images'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    protractor: {
      options: {
        configFile: 'protractor/conf.js',
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false,
        args: {
        }
      },
      all: {
        options: {
        }
      },
    },

    aws: grunt.file.readJSON('aws-keys.json'), // Read the file

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.key %>', // Use the variables
        secretAccessKey: '<%= aws.secret %>', // You can also use env variables
        region: 'us-west-2',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      production: {
        options: {
          bucket: '<%= aws.bucket %>',
          // gzip is breaking browsers.  investigate doing our own gzip or having AWS do it.
          // params: {
          //   ContentEncoding: 'gzip' // applies to all the files!
          // },
          // mime: {
          //   'dist/assets/production/LICENCE': 'text/plain'
          // }
        },
        files: [
          {differential: false, expand: true, cwd: 'dist/', src: ['**'], dest: '/', params: {CacheControl: '60'}},
        ]
      },
      qa: {
        options: {
          bucket: '<%= aws.qaBucket %>',
        },
        files: [
          {differential: false, expand: true, cwd: 'dist/', src: ['**'], dest: '/', params: {CacheControl: '60'}},
        ]
      },
    }

  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target, env) {
    target = target || 'dev';

    if (target === 'dist') {
      return env === undefined ?
        grunt.util.error('Expected: serve, serve:{ENV}, or serve:dist:{ENV}') :
        grunt.task.run(['build:' + env, 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'newer:jshint',
      'jscs',
      'clean:dist',
      'clean:server',
      'ngconstant:' + target,
      'wiredep',
      'compass:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', 'Build package for deployment', function(env) {
    if (env === undefined) {
      return grunt.util.error('Expected: build:{ENV}');
    }

    grunt.task.run([
      'clean:dist',
      'wiredep',
      'useminPrepare',
      'compass:dist',
      'ngconstant:' + env,
      'imagemin',
      'autoprefixer',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cssmin',
      'uglify',
      'filerev',
      'usemin'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'compass',
    'autoprefixer',
    'connect:test',
    'ngconstant:production',
    'karma'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build:prod'
  ]);
};
