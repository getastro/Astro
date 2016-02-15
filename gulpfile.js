var gulp = require('gulp');
var jslint = require('gulp-jslint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var files = ['src/*.js'];
// build the main source into the min file
gulp.task('lint', function () {
    'use strict';
    return gulp.src(files)
        .pipe(jslint({
            browser: true,
            vars: true,
            for: true,
            white: true,
            newcap:true,
            predef: ["require", "console", "AstroWP",
            "ActiveXObject", "util","CustomEvent"],
            reporter: 'default'
        }))
        .on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('watch', function () {
    'use strict';
    gulp.watch(files, ['lint']); // watching files and call the defined work flow
});

// minify the js
gulp.task('minify', function() {
  return gulp.src(files)
    .pipe(uglify({
        preserveComments:"license",
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);
