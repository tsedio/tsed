import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioDatabase} from "../services/FormioDatabase";
import {AlterTemplateImportSteps} from "./AlterTemplateImportSteps";

const sandbox = Sinon.createSandbox();

async function createServiceFixture() {
  const mapper = {
    mapToImport: sandbox.stub().callsFake((data) => {
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
      deleteMany: sandbox.stub(),
      create: sandbox.stub()
    },
    getFormioMapper: sandbox.stub().resolves(mapper)
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
  afterEach(() => sandbox.restore());

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

    queue = service.transform(queue, sandbox.stub(), template);

    expect(queue.length).to.eq(1);

    await new Promise((resolve) => queue[0](resolve));

    expect(database.submissionModel.deleteMany).to.have.been.calledWithExactly({});
    expect(database.submissionModel.create).to.have.been.calledWithExactly({
      form: "form_id",
      data: {},
      roles: ["admin"]
    });
  });
});
