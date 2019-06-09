const glob = require("globby");
const path = require("path");
const {projectsDir} = require("../../../repo.config");

exports.findIntegrationProjects = () => {
  const projects = glob.sync("*/package.json", {
    cwd: path.join(process.cwd(), projectsDir)
  });

  return projects.map((project) => {
    return project.split("/")[0]
  });
};
