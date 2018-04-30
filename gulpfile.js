const tasks = require('require-dir')('./tasks/');
const loadTasks = require('./tasks/utils/loadTasks');
const gulp = require('gulp');


// LOAD TASKS

loadTasks(tasks);

gulp.task('build', gulp.series('copy:files', 'tsc', 'copy:src', gulp.parallel('copy:packages', 'write-pkg', 'copy:readme')));
gulp.task('build:doc', gulp.series('tsc', 'copy:src', 'sass:doc', 'doc'));