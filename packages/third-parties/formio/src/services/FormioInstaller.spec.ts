import {PlatformTest} from "@tsed/common";
import {FormioService} from "@tsed/formio";
import {expect} from "chai";
import faker from "@faker-js/faker";
import Sinon from "sinon";
import {FormioInstaller} from "./FormioInstaller";

const sandbox = Sinon.createSandbox();

async function createFormioInstallerFixture(options: any = {}) {
  const {
    count = 1,
    errorCount = null,
    submission = {
      _id: "id",
      data: {}
    },
    errorSubmission = null
  } = options;

  const collections = {
    estimatedDocumentCount: sandbox.stub().callsArgWith(0, errorCount, count)
  };
  const formioService = {
    db: {
      collection: sandbox.stub().returns(collections)
    },
    formio: {},
    encrypt: sandbox.stub().resolves("hash"),
    resources: {
      submission: {
        model: {
          create: sandbox.stub().callsArgWith(1, errorSubmission, submission)
        }
      }
    },
    importTemplate: sandbox.stub().callsFake((o) => o)
  };
  const service = await PlatformTest.invoke<FormioInstaller>(FormioInstaller, [
    {
      token: FormioService,
      use: formioService
    }
  ]);

  return {service, formioService, collections};
}

describe("FormioImporter", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("createRootUser()", () => {
    it("should create the user root", async () => {
      const {service, formioService} = await createFormioInstallerFixture({count: 1});
      const template = {
        resources: {
          admin: {
            _id: faker.datatype.uuid()
          }
        },
        roles: {
          administrator: {
            _id: faker.datatype.uuid()
          }
        }
      };

      const user = {
        email: faker.internet.email(),
        password: faker.internet.password(12)
      };

      expect(await service.createRootUser(user, template as any)).to.deep.eq({
        _id: "id",
        data: {}
      });
      expect(formioService.resources.submission.model.create).to.have.been.calledWithExactly(
        {
          data: {email: user.email, password: "hash"},
          form: template.resources.admin._id,
          roles: [template.roles.administrator._id]
        },
        Sinon.match.func
      );
    });
    it("should throw error", async () => {
      const {service, formioService} = await createFormioInstallerFixture({errorSubmission: new Error("message")});
      const template = {
        resources: {
          admin: {
            _id: faker.datatype.uuid()
          }
        },
        roles: {
          administrator: {
            _id: faker.datatype.uuid()
          }
        }
      };

      const user = {
        email: faker.internet.email(),
        password: faker.internet.password(12)
      };

      let actualError: any;
      try {
        await service.createRootUser(user, template as any);
      } catch (er) {
        actualError = er;
      }
      expect(actualError.message).to.deep.eq("message");
    });
  });
  describe("install()", () => {
    it("should install database", async () => {
      const {service, formioService} = await createFormioInstallerFixture({count: 1});
      const template = {
        resources: {
          admin: {
            _id: faker.datatype.uuid()
          }
        },
        roles: {
          administrator: {
            _id: faker.datatype.uuid()
          }
        }
      };

      const user = {
        email: faker.internet.email(),
        password: faker.internet.password(12)
      };

      sandbox.stub(service, "createRootUser");

      await service.install(template as any, user);

      expect(formioService.importTemplate).to.have.been.calledWithExactly(template);
      expect(service.createRootUser).to.have.been.calledWithExactly(user, template);
    });
  });
});
