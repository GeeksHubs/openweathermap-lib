module.exports = function (grunt) {

  'use strict';

  var bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> \n ' +
    ' *  License: <%= pkg.license %> */';
  var name = '<%= pkg.name %>-v<%= pkg.version%>';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsbeautifier: {
      files: ['package.json', 'Gruntfile.js', "src/**/*.js"],
      options: {
        js: {
          "indent_size": 2,
          "indent_char": " ",
          "other": " ",
          "indent_level": 0,
          "indent_with_tabs": false,
          "preserve_newlines": true,
          "max_preserve_newlines": 2,
          "jslint_happy": true,
          "indent_handlebars": true,
          "object": {}
        }
      }
    },

    jshint: {
      target: ['package.json', 'Gruntfile.js', 'src/.jshintrc', 'src/**/*.js'],
      options: {
        curly: true,
        eqnull: true,
        browser: true
      }
    },

    clean: {
      target: {
        src: ['dist/']
      }
    },

    copy: {
      target: {
        expand: true,
        cwd: 'src/',
        src: '**/*.js',
        dest: 'dist/'
      }
    },

    uglify: {
      options: {
        banner: bannerContent,
        sourceMapRoot: '../',
        sourceMap: 'dist/' + name + '.min.js.map',
        sourceMapUrl: name + '.min.js.map'
      },
      target: {
        src: ['src/**/*.js'],
        dest: 'dist/' + name + '.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jsbeautifier', 'jshint', 'clean', 'copy', 'uglify']);
};
