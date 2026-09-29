import fs from "fs-extra";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {createDmmfFixture} from "../__mock__/createDmmfFixture.js";
import {createProjectFixture} from "../__mock__/createProjectFixture.js";
import {generateCode} from "./generateCode.js";

describe("generateCode", () => {
  it("should only transpile the generated Ts.ED files and leave the Prisma client sources untouched", async () => {
    const root = await fs.mkdtemp(join(tmpdir(), "tsed-prisma-"));
    const clientDir = join(root, "client");
    const outputDir = join(root, "tsed");

    try {
      await fs.mkdir(clientDir, {recursive: true});
      await fs.writeFile(join(clientDir, "client.ts"), "export class Prisma { get user(): string; }\n");

      await generateCode(createDmmfFixture(), {
        emitTranspiledCode: true,
        outputDirPath: outputDir,
        prismaClientPath: "../client",
        prismaClientEntry: "client"
      });

      expect(await fs.pathExists(join(outputDir, "index.js"))).toBe(true);
      expect(await fs.pathExists(join(clientDir, "client.js"))).toBe(false);
    } finally {
      await fs.remove(root);
    }
  });

  it("should generate all codes", async () => {
    const {baseDir} = createProjectFixture("generate_code");
    const dmmf = createDmmfFixture();

    await generateCode(dmmf, {
      emitTranspiledCode: false,
      outputDirPath: baseDir,
      prismaClientPath: "@prisma/client"
    });
  });
});
