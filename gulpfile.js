var gulp = require('gulp');
var jslint = require('gulp-jslint');
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
gulp.task('default', ['watch']);
