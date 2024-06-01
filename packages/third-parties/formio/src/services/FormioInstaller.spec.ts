import faker from "@faker-js/faker";
import {PlatformTest} from "@tsed/common";
import {FormioInstaller} from "./FormioInstaller.js";
import {FormioService} from "./FormioService.js";

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
    estimatedDocumentCount: jest.fn().mockImplementation((cb) => {
      cb(errorCount, count);
    })
  };
  const formioService = {
    db: {
      collection: jest.fn().mockReturnValue(collections)
    },
    formio: {},
    encrypt: jest.fn().mockResolvedValue("hash"),
    resources: {
      submission: {
        model: {
          create: jest.fn().mockImplementation((_, cb) => {
            cb(errorSubmission, submission);
          })
        }
      }
    },
    importTemplate: jest.fn().mockImplementation((o) => o)
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

      expect(await service.createRootUser(user, template as any)).toEqual({
        _id: "id",
        data: {}
      });
      expect(formioService.resources.submission.model.create).toHaveBeenCalledWith(
        {
          data: {email: user.email, password: "hash"},
          form: template.resources.admin._id,
          roles: [template.roles.administrator._id]
        },
        expect.any(Function)
      );
    });
    it("should throw error", async () => {
      const {service} = await createFormioInstallerFixture({errorSubmission: new Error("message")});
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
      expect(actualError.message).toEqual("message");
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

      jest.spyOn(service, "createRootUser");

      await service.install(template as any, user);

      expect(formioService.importTemplate).toHaveBeenCalledWith(template);
      expect(service.createRootUser).toHaveBeenCalledWith(user, template);
    });
  });
});
