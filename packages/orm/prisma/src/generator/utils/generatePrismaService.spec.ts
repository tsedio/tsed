import {generatePrismaService} from "./generatePrismaService.js";
import {createProjectFixture} from "../../__mock__/createProjectFixture.js";

describe("generatePrismaService", () => {
  it("should generate prisma service", () => {
    const {project, render, baseDir} = createProjectFixture("generate_prisma_service");

    generatePrismaService(project, baseDir);

    render("/services/PrismaService.ts").toMatchSnapshot();
  });
});
