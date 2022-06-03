import {createProjectFixture} from "../../__mock__/createProjectFixture";
import {generateModels} from "./generateModels";
import {createDmmfFixture} from "../../__mock__/createDmmfFixture";
import {generateEnums} from "./generateEnums";

describe("generateEnums", () => {
  it("should generate filese", () => {
    const {project, render, baseDir} = createProjectFixture("generate_enums");
    const dmmf = createDmmfFixture();

    generateEnums(dmmf, project, baseDir);

    render("/enums/Role.ts").toMatchSnapshot();
  });
});
