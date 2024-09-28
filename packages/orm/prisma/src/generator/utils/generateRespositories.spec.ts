import {createDmmfFixture} from "../../__mock__/createDmmfFixture.js";
import {createProjectFixture} from "../../__mock__/createProjectFixture.js";
import {generateRepositories} from "./generateRepositories.js";

describe("generateRepositories", () => {
  it("should generate repositories (user)", () => {
    const {project, render, baseDir} = createProjectFixture("generate_repositories");
    const dmmf = createDmmfFixture();

    generateRepositories(dmmf, project, baseDir);

    const userRepo = render("/repositories/UsersRepository.ts");

    userRepo.not.toContain("Post");
    userRepo.toMatchSnapshot();
  });

  it("should generate repositories (posts)", () => {
    const {project, render, baseDir} = createProjectFixture("generate_repositories");
    const dmmf = createDmmfFixture();

    generateRepositories(dmmf, project, baseDir);

    const postsRepository = render("/repositories/PostsRepository.ts");

    postsRepository.not.toContain("User");
    postsRepository.toMatchSnapshot();
  });
});
