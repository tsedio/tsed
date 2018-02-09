const gulp = require('gulp');

module.exports = (tasks, ...args) => {

  /**
   *
   * @param taskName
   * @param task
   * @returns {*}
   */
  const addTask = (taskName, task) => gulp.task(taskName, (cb) => task(gulp, ...args, cb));
  /**
   *
   * @param tasks
   * @param parent
   */
  const loadTasks = (tasks, parent = '') =>
    Object.keys(tasks).forEach((taskName) => {
      const task = tasks[taskName];
      if (typeof task === 'function') {
        addTask(parent + taskName, task);
      } else {
        loadTasks(task, `${taskName}:`);
      }
    });

  return loadTasks(tasks);
};