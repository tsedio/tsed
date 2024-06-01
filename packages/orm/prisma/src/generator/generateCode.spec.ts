import {generateCode} from "./generateCode.js";
import {createProjectFixture} from "../__mock__/createProjectFixture.js";
import {createDmmfFixture} from "../__mock__/createDmmfFixture.js";

describe("generateCode", () => {
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
