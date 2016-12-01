module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    "babel": {
      dist: {
        files: [{
          expand : true,
          cwd : 'sites/static/src/jsx',
          src : '*.jsx',
          dest : 'sites/static/js/',
          ext : '.js'
        }]
      }
    },
    "less" : {
      dist : {
        files : [{
          expand : true,
          cwd : 'sites/static/src/less',
          src : '*.less',
          dest : 'sites/static/css/',
          ext : '.css'
        }]
      }
    },
    "watch" : {
      babel : {
        files : ['sites/static/src/jsx/*.jsx'],
        tasks : ['babel']
      },
      less : {
        files : ['sites/static/src/less/*.less'],
        tasks : ['less']
      }
    }
  });

  grunt.registerTask("default", ["watch"]);

};