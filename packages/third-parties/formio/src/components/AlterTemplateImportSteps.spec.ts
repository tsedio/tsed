import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioDatabase} from "../services/FormioDatabase.js";
import {AlterTemplateImportSteps} from "./AlterTemplateImportSteps.js";

async function createServiceFixture() {
  const mapper = {
    mapToImport: vi.fn().mockImplementation((data) => {
      if (data && data.data) {
        return {
          form: "form_id",
          data: {},
          roles: []
        };
      }
      return data;
    })
  };

  const database = {
    submissionModel: {
      deleteMany: vi.fn(),
      create: vi.fn()
    },
    getFormioMapper: vi.fn().mockResolvedValue(mapper)
  };

  const service = await PlatformTest.invoke<AlterTemplateImportSteps>(AlterTemplateImportSteps, [
    {
      token: FormioDatabase,
      use: database
    }
  ]);

  return {service, mapper, database};
}

describe("AlterTemplateImportSteps", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should import submission", async () => {
    const {service, database} = await createServiceFixture();
    let queue: any[] = [];
    const template: any = {
      submissions: {
        admin: [
          {
            form: "$machineName:admin",
            data: {},
            roles: ["admin", "admin"]
          }
        ]
      }
    };

    queue = service.transform(queue, vi.fn(), template);

    expect(queue.length).toEqual(1);

    await new Promise((resolve) => queue[0](resolve));

    expect(database.submissionModel.deleteMany).toHaveBeenCalledWith({});
    expect(database.submissionModel.create).toHaveBeenCalledWith({
      form: "form_id",
      data: {},
      roles: ["admin"]
    });
  });
});
