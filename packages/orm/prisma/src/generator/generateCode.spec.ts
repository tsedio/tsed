import {generateCode} from "./generateCode";
import {createProjectFixture} from "../__mock__/createProjectFixture";
import {createDmmfFixture} from "../__mock__/createDmmfFixture";

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
