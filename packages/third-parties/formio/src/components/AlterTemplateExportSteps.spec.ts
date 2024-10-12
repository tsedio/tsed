import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioDatabase} from "../services/FormioDatabase.js";
import {AlterTemplateExportSteps} from "./AlterTemplateExportSteps.js";

async function createServiceFixture() {
  const mapper = {
    mapToExport: vi.fn().mockImplementation((data) => {
      if (data === "form_id") {
        return "machineName";
      }
      return data;
    })
  };

  const database = {
    submissionModel: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      find: vi.fn()
    },
    getFormioMapper: vi.fn().mockResolvedValue(mapper)
  };

  const service = await PlatformTest.invoke<AlterTemplateExportSteps>(AlterTemplateExportSteps, [
    {
      token: FormioDatabase,
      use: database
    }
  ]);

  return {service, mapper, database};
}

describe("AlterTemplateExportSteps", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should export submission", async () => {
    const {service, database} = await createServiceFixture();
    let queue: any[] = [];
    const map = {};
    const options = {};
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

    database.submissionModel.find.mockResolvedValue([
      {
        toObject() {
          return {
            _id: "_id",
            created: "created",
            updated: "updated",
            deleted: "deleted",
            modified: "modified",
            __v: "__v",
            owner: "owner",
            roles: ["roles"],
            form: "form_id",
            metadata: "metadata",
            data: {}
          };
        }
      }
    ]);

    queue = service.transform(queue, template, map, options);

    expect(queue.length).toEqual(1);

    const result = await new Promise((resolve) => queue[0]((err: any, template: any) => resolve(template)));

    expect(result).toEqual({
      submissions: {
        machineName: [
          {
            created: "created",
            data: {},
            deleted: "deleted",
            form: "machineName",
            modified: "modified",
            roles: ["roles"]
          }
        ]
      }
    });
    expect(database.getFormioMapper).toHaveBeenCalledWith();
    expect(database.submissionModel.find).toHaveBeenCalledWith({deleted: {$eq: null}});
  });
});
