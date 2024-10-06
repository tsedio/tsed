import {createDmmfFixture} from "../../__mock__/createDmmfFixture.js";
import {createProjectFixture} from "../../__mock__/createProjectFixture.js";
import {generateEnums} from "./generateEnums.js";
import {generateModels} from "./generateModels.js";

describe("generateEnums", () => {
  it("should generate filese", () => {
    const {project, render, baseDir} = createProjectFixture("generate_enums");
    const dmmf = createDmmfFixture();

    generateEnums(dmmf, project, baseDir);

    render("/enums/Role.ts").toMatchSnapshot();
  });
});
