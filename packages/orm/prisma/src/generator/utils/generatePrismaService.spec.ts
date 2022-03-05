import {generatePrismaService} from "./generatePrismaService";
import {createProjectFixture} from "../../__mock__/createProjectFixture";

describe("generatePrismaService", () => {
  it("should generate prisma service", () => {
    const {project, render, baseDir} = createProjectFixture("generate_prisma_service");

    generatePrismaService(project, baseDir);

    render("/services/PrismaService.ts").toEqualSnapshot();
  });
});
