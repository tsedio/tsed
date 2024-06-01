import {createProjectFixture} from "../../__mock__/createProjectFixture.js";
import {generateModels} from "./generateModels.js";
import {createDmmfFixture} from "../../__mock__/createDmmfFixture.js";
import {generateEnums} from "./generateEnums.js";

describe("generateEnums", () => {
  it("should generate filese", () => {
    const {project, render, baseDir} = createProjectFixture("generate_enums");
    const dmmf = createDmmfFixture();

    generateEnums(dmmf, project, baseDir);

    render("/enums/Role.ts").toMatchSnapshot();
  });
});
