const tasks = require('require-dir')('./tasks/');
const loadTasks = require('./tasks/utils/loadTasks');
const runSeq = require('./tasks/utils/runSeq');
const plugins = require('gulp-load-plugins')();
const gulp = require('gulp');


// LOAD TASKS

loadTasks(tasks, plugins);

gulp.task('build', runSeq('copy:files', 'tsc', 'copy:src', ['copy:packages', 'write-pkg', 'copy:readme']));
gulp.task('build:doc', runSeq('tsc', 'copy:src', 'sass:doc', 'doc'));