const gulp = require('gulp');

module.exports = (tasks) => {

  /**
   *
   * @param taskName
   * @param task
   * @returns {*}
   */
  const addTask = (taskName, task) => gulp.task(taskName, (cb) => {
    const r = task(gulp, cb);
    if (task.length === 1 && !r) {
      cb();
    }
    return r;
  });
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