import {createProjectFixture} from "../../__mock__/createProjectFixture";
import {createDmmfFixture} from "../../__mock__/createDmmfFixture";
import {generateRepositories} from "./generateRepositories";

describe("generateRepositories", () => {
  it("should generate repositories", () => {
    const {project, render, baseDir} = createProjectFixture("generate_repositories");
    const dmmf = createDmmfFixture();

    generateRepositories(dmmf, project, baseDir);

    const userRepo = render("/repositories/UsersRepository.ts");

    userRepo.not.toContain("Post");
    userRepo.toEqualSnapshot();

    const postsRepository = render("/repositories/PostsRepository.ts");

    postsRepository.not.toContain("User");
    postsRepository.toEqualSnapshot();
  });
});
