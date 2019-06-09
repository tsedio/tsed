const {projectsDir} = require("../../../repo.config");

exports.findIntegrationProjects = () => {
  const projects = glob.sync("*", {
    cwd: projectsDir
  });

  return projects.map((project) => project.split("/")[0]);
};
