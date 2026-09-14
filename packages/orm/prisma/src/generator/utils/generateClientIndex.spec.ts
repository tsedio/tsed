import {createProjectFixture} from "../../__mock__/createProjectFixture.js";
import {generateClientIndex} from "./generateClientIndex.js";

describe("generateClientIndex", () => {
  it("should generate a client index for a relative custom Prisma Client output", () => {
    const {project, render, baseDir} = createProjectFixture("generate_client_index");

    generateClientIndex(project, baseDir, {
      emitTranspiledCode: false,
      outputDirPath: baseDir,
      prismaClientPath: "../generated/@prisma/client"
    });

    render("/client/index.ts").toContain('export * from "../../generated/@prisma/client/index.js";');
  });
});
