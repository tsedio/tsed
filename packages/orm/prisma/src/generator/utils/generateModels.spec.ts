import {createProjectFixture} from "../../__mock__/createProjectFixture";
import {generateModels} from "./generateModels";
import {createDmmfFixture} from "../../__mock__/createDmmfFixture";

describe("generateModels", () => {
  it("should generate models", () => {
    const {project, render, baseDir} = createProjectFixture("generate_models");
    const dmmf = createDmmfFixture();

    generateModels(dmmf, project, baseDir);

    render("/models/UserModel.ts").toEqualSnapshot();
    render("/models/PostModel.ts").toEqualSnapshot();
  });
});
