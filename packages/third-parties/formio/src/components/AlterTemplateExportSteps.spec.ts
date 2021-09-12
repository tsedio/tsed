import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioDatabase} from "../services/FormioDatabase";
import {AlterTemplateExportSteps} from "./AlterTemplateExportSteps";

const sandbox = Sinon.createSandbox();

async function createServiceFixture() {
  const mapper = {
    mapToExport: sandbox.stub().callsFake((data) => {
      if (data === "form_id") {
        return "machineName";
      }
      return data;
    })
  };

  const database = {
    submissionModel: {
      deleteMany: sandbox.stub(),
      create: sandbox.stub(),
      find: sandbox.stub()
    },
    getFormioMapper: sandbox.stub().resolves(mapper)
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
  afterEach(() => sandbox.restore());

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

    database.submissionModel.find.resolves([
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

    expect(queue.length).to.eq(1);

    const result = await new Promise((resolve) => queue[0]((err: any, template: any) => resolve(template)));

    expect(result).to.deep.eq({
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
    expect(database.getFormioMapper).to.have.been.calledWithExactly();
    expect(database.submissionModel.find).to.have.been.calledWithExactly({deleted: {$eq: null}});
  });
});
