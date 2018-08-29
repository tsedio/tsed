const tasks = require('require-dir')('./tasks/gulp');
const loadTasks = require('./tasks/gulp/utils/loadTasks');

// LOAD TASKS
loadTasks(tasks);