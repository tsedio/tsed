import {createProjectFixture} from "../../__mock__/createProjectFixture";
import {generateModels} from "./generateModels";
import {createDmmfFixture} from "../../__mock__/createDmmfFixture";

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
});
