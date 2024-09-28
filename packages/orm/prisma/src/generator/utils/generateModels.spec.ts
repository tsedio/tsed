import {createDmmfFixture, createDmmfWithTypesFixture} from "../../__mock__/createDmmfFixture.js";
import {createProjectFixture} from "../../__mock__/createProjectFixture.js";
import {generateModels} from "./generateModels.js";

describe("generateModels", () => {
  it("should generate models (post)", () => {
    const {project, render, baseDir} = createProjectFixture("generate_models");
    const dmmf = createDmmfFixture();

    generateModels(dmmf, project, baseDir);

    render("/models/PostModel.ts").toMatchSnapshot();
  });
  it("should generate models (user)", () => {
    const {project, render, baseDir} = createProjectFixture("generate_models");
    const dmmf = createDmmfFixture();

    generateModels(dmmf, project, baseDir);

    render("/models/UserModel.ts").toMatchSnapshot();
  });
  it("should generate models (info)", () => {
    const {project, render, baseDir} = createProjectFixture("generate_models");
    const dmmf = createDmmfWithTypesFixture();

    generateModels(dmmf, project, baseDir);

    render("/models/InfoModel.ts").toMatchSnapshot();
  });
});
