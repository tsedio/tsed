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
        form: class {
          static countDocuments = sandbox.stub();
          static find = sandbox.stub().resolves([{_id: "form_id", machineName: "form_machine"}]);
          static findOne = sandbox.stub().returnsThis();
          static findOneAndUpdate = sandbox.stub();
          static updateOne = sandbox.stub().returnsThis();
          static lean = sandbox.stub().returnsThis();
          static exec = sandbox.stub();

          constructor(public ctrOpts: any) {}

          save(): any {}

          toObject() {
            return this.ctrOpts;
          }
        },
        action: {
          find: sandbox.stub().resolves([{_id: "action_id", machineName: "action_machine"}])
        },
        submission: {
          find: sandbox.stub().resolves([]),
          findOneAndUpdate: sandbox.stub().callsFake((o, o1) => ({...o, ...o1, _id: o._id || "newID"}))
        },
        token: {},
        actionItem: {}
      }
    },
    util: {
      idToBson: sandbox.stub()
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
  describe("importFormIfNotExists()", () => {
    it("should return create the form if not exists", async () => {
      const {service, formioService} = await createServiceFixture();
      const onCreate = sandbox.stub();
      const form: any = {
        name: "name"
      };

      formioService.mongoose.models.form.countDocuments.resolves(false);
      formioService.mongoose.models.form.exec.resolves({
        _id: "id",
        name: "name"
      });

      const result = await service.importFormIfNotExists(form, onCreate);

      expect(result).to.deep.eq({
        _id: "id",
        name: "name"
      });
      expect(onCreate).to.have.been.calledOnce;
    });
    it("should not create form is exists", async () => {
      const {service, formioService} = await createServiceFixture();
      const onCreate = sandbox.stub();
      const form: any = {
        name: "name"
      };

      formioService.mongoose.models.form.countDocuments.resolves(true);
      formioService.mongoose.models.form.exec.resolves({
        _id: "id",
        name: "name"
      });

      const result = await service.importFormIfNotExists(form, onCreate);

      expect(result).to.deep.equal({
        _id: "id",
        name: "name"
      });
    });
  });
  describe("getSubmissions()", () => {
    it("should return submissions", async () => {
      const {service} = await createServiceFixture();

      const result = await service.getSubmissions();

      expect(result).to.deep.eq([]);
      expect(service.submissionModel.find).to.have.been.calledWithExactly({deleted: {$eq: null}});
    });
    it("should return submissions with query", async () => {
      const {service} = await createServiceFixture();

      const result = await service.getSubmissions({
        form: "id"
      });

      expect(result).to.deep.eq([]);
      expect(service.submissionModel.find).to.have.been.calledWithExactly({deleted: {$eq: null}, form: "id"});
    });
  });
  describe("saveSubmissions()", () => {
    it("should create submission", async () => {
      const {service} = await createServiceFixture();

      const result = await service.saveSubmission({
        data: {}
      });

      expect(result).to.deep.eq({
        _id: "newID",
        data: {}
      });
      expect(service.submissionModel.findOneAndUpdate).to.have.been.calledWithExactly(
        {_id: undefined},
        {data: {}},
        {new: true, upsert: true}
      );
    });
    it("should update submission", async () => {
      const {service} = await createServiceFixture();

      const result = await service.saveSubmission({
        _id: "id",
        data: {}
      });

      expect(result).to.deep.eq({
        _id: "id",
        data: {}
      });
      expect(service.submissionModel.findOneAndUpdate).to.have.been.calledWithExactly(
        {_id: "id"},
        {_id: "id", data: {}},
        {new: true, upsert: true}
      );
    });
  });
  describe("importSubmission()", () => {
    it("should import submission", async () => {
      const {service} = await createServiceFixture();

      Sinon.stub(service, "saveSubmission").resolves({} as any);

      const result = await service.importSubmission({
        _id: "id",
        data: {}
      });

      expect(result).to.deep.eq({});
      expect(service.saveSubmission).to.have.been.calledWithExactly({_id: "id", data: {}});
    });
  });
  describe("getForm", () => {
    it("should return form from id", async () => {
      const {service, formioService} = await createServiceFixture();

      await service.getForm("605f0d40fe971372e448bcad");

      expect(formioService.mongoose.models.form.findOne).to.have.been.calledWithExactly({
        _id: "605f0d40fe971372e448bcad",
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.form.lean).to.have.been.calledWithExactly();
      expect(formioService.mongoose.models.form.exec).to.have.been.calledWithExactly();
    });

    it("should return form from machineName", async () => {
      const {service, formioService} = await createServiceFixture();

      await service.getForm("name");

      expect(formioService.mongoose.models.form.findOne).to.have.been.calledWithExactly({
        name: {$eq: "name"},
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.form.lean).to.have.been.calledWithExactly();
      expect(formioService.mongoose.models.form.exec).to.have.been.calledWithExactly();
    });
  });
  describe("idToBson", () => {
    beforeEach(() => {});
    it("should convert id", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.util.idToBson.returns({bson: "bson"});
      expect(service.idToBson("id")).to.deep.equal({bson: "bson"});
      expect(service.idToBson(["id"])).to.deep.equal({$in: [{bson: "bson"}]});
      expect(service.idToBson({_id: "id"})).to.deep.equal({bson: "bson"});
      expect(service.idToBson()).to.deep.equal(undefined);
    });
  });
});
