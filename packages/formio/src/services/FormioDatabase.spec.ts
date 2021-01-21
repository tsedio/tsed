import {PlatformTest} from "@tsed/common";
import {FormioService} from "@tsed/formio";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioDatabase} from "./FormioDatabase";

const sandbox = Sinon.createSandbox();

async function createServiceFixture() {
  const formioService = {
    mongoose: {
      models: {
        role: {
          find: sandbox.stub().resolves([{_id: "role_id", machineName: "role_machine"}])
        },
        form: {
          countDocuments: sandbox.stub(),
          find: sandbox.stub().resolves([{_id: "form_id", machineName: "form_machine"}])
        },
        action: {
          find: sandbox.stub().resolves([{_id: "action_id", machineName: "action_machine"}])
        },
        submission: {
          find: sandbox.stub()
        },
        token: {},
        actionItem: {}
      }
    }
  };
  const service = await PlatformTest.invoke<FormioDatabase>(FormioDatabase, [
    {
      token: FormioService,
      use: formioService
    }
  ]);

  return {service, formioService};
}

describe("FormioDatabase", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  describe("getFormioMapper()", () => {
    it("should return the mapper", async () => {
      const {service, formioService} = await createServiceFixture();

      const mapper = await service.getFormioMapper();

      expect([...mapper.ctxData.forms.entries()]).to.deep.eq([
        [
          "form_id",
          {
            _id: "form_id",
            machineName: "form_machine"
          }
        ],
        [
          "$machineName:form_machine",
          {
            _id: "form_id",
            machineName: "form_machine"
          }
        ]
      ]);
      expect([...mapper.ctxData.actions.entries()]).to.deep.eq([
        [
          "action_id",
          {
            _id: "action_id",
            machineName: "action_machine"
          }
        ],
        [
          "$machineName:action_machine",
          {
            _id: "action_id",
            machineName: "action_machine"
          }
        ]
      ]);
      expect([...mapper.ctxData.roles.entries()]).to.deep.eq([
        [
          "role_id",
          {
            _id: "role_id",
            machineName: "role_machine"
          }
        ],
        [
          "$machineName:role_machine",
          {
            _id: "role_id",
            machineName: "role_machine"
          }
        ]
      ]);

      expect(formioService.mongoose.models.form.find).to.have.been.calledWithExactly({
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.role.find).to.have.been.calledWithExactly({
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.action.find).to.have.been.calledWithExactly({
        deleted: {$eq: null}
      });
    });
  });
  describe("hasForm()", () => {
    it("should return true when database contain forms", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.mongoose.models.form.countDocuments.resolves(6);

      expect(await service.hasForms()).to.eq(true);
    });

    it("should return false when database has no forms", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.mongoose.models.form.countDocuments.resolves(0);

      expect(await service.hasForms()).to.eq(false);
    });
  });
  describe("submissionModel()", () => {
    it("should return the submissionModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.submissionModel).to.deep.eq(formioService.mongoose.models.submission);
    });
  });
  describe("tokenModel()", () => {
    it("should return the tokenModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.tokenModel).to.deep.eq(formioService.mongoose.models.token);
    });
  });
  describe("actionItemModel()", () => {
    it("should return the actionItemModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.actionItemModel).to.deep.eq(formioService.mongoose.models.actionItem);
    });
  });
});
