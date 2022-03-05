import {ModuleKind, Project, ScriptTarget} from "ts-morph";
import {ensureDirSync, existsSync} from "fs-extra";
import {dirname, join} from "path";
import {readFileSync, writeFileSync} from "fs";

const SNAPSHOT_DIR = `${__dirname}/../../test/snapshots`;

export function createProjectFixture(dir = "/") {
  const baseDir = join(SNAPSHOT_DIR, dir);
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2019,
      module: ModuleKind.CommonJS,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      esModuleInterop: true
    }
  });

  return {
    project,
    baseDir,
    render(file: string) {
      const absolutePath = join(baseDir, file);
      const sourceFile = project.getSourceFile(absolutePath);

      if (!sourceFile) {
        throw `File not found: ${file}`;
      }

      sourceFile.formatText({indentSize: 2});
      const actualValue = sourceFile.getFullText();

      if (!existsSync(absolutePath)) {
        ensureDirSync(dirname(absolutePath));
        writeFileSync(absolutePath, actualValue, {encoding: "utf8"});
      }

      const expectedValue = readFileSync(absolutePath, {encoding: "utf8"});

      return {
        ...expect(actualValue),
        toEqualSnapshot() {
          expect(actualValue).toEqual(expectedValue);
        }
      };
    }
  };
}
