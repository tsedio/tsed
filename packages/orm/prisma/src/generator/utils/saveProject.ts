import type {Project} from "ts-morph";

export async function saveProject(project: Project) {
  for (const file of project.getSourceFiles()) {
    file.formatText({indentSize: 2});
  }
  await project.save();
}
