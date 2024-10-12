import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioDatabase} from "./FormioDatabase.js";
import {FormioService} from "./FormioService.js";

async function createServiceFixture() {
  const formioService = {
    mongoose: {
      models: {
        role: {
          find: vi.fn().mockResolvedValue([{_id: "role_id", machineName: "role_machine"}])
        },
        form: class {
          static countDocuments = vi.fn();
          static find = vi.fn().mockResolvedValue([{_id: "form_id", machineName: "form_machine"}]);
          static findOne = vi.fn().mockReturnThis();
          static findOneAndUpdate = vi.fn();
          static updateOne = vi.fn().mockReturnThis();
          static lean = vi.fn().mockReturnThis();
          static exec = vi.fn();

          constructor(public ctrOpts: any) {
            Object.assign(this, ctrOpts);
          }

          save(): any {}

          toObject() {
            return this.ctrOpts;
          }
        },
        action: {
          find: vi.fn().mockResolvedValue([{_id: "action_id", machineName: "action_machine"}])
        },
        submission: class {
          static find = vi.fn().mockResolvedValue([]);
          static findOneAndUpdate = vi.fn().mockImplementation((o, o1) => ({...o, ...o1}));

          constructor(o: any) {
            Object.assign(this, {
              ...o,
              _id: o._id || "newID"
            });
          }
        },
        token: {},
        actionItem: {}
      }
    },
    util: {
      idToBson: vi.fn()
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

  describe("getFormioMapper()", () => {
    it("should return the mapper", async () => {
      const {service, formioService} = await createServiceFixture();

      const mapper = await service.getFormioMapper();

      expect([...mapper.ctxData.forms.entries()]).toEqual([
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
      expect([...mapper.ctxData.actions.entries()]).toEqual([
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
      expect([...mapper.ctxData.roles.entries()]).toEqual([
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

      expect(formioService.mongoose.models.form.find).toHaveBeenCalledWith({
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.role.find).toHaveBeenCalledWith({
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.action.find).toHaveBeenCalledWith({
        deleted: {$eq: null}
      });
    });
  });
  describe("hasForm()", () => {
    it("should return true when database contain forms", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.mongoose.models.form.countDocuments.mockResolvedValue(6);

      expect(await service.hasForms()).toEqual(true);
    });

    it("should return false when database has no forms", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.mongoose.models.form.countDocuments.mockResolvedValue(0);

      expect(await service.hasForms()).toEqual(false);
    });
  });
  describe("submissionModel()", () => {
    it("should return the submissionModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.submissionModel).toEqual(formioService.mongoose.models.submission);
    });
  });
  describe("tokenModel()", () => {
    it("should return the tokenModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.tokenModel).toEqual(formioService.mongoose.models.token);
    });
  });
  describe("actionItemModel()", () => {
    it("should return the actionItemModel", async () => {
      const {service, formioService} = await createServiceFixture();
      expect(service.actionItemModel).toEqual(formioService.mongoose.models.actionItem);
    });
  });
  describe("importFormIfNotExists()", () => {
    it("should return create the form if not exists", async () => {
      const {service, formioService} = await createServiceFixture();
      const onCreate = vi.fn();
      const form: any = {
        name: "name"
      };

      formioService.mongoose.models.form.countDocuments.mockResolvedValue(false);
      formioService.mongoose.models.form.exec.mockResolvedValue({
        _id: "id",
        name: "name"
      });

      const result = await service.importFormIfNotExists(form, onCreate);

      expect(result).toEqual({
        _id: "id",
        name: "name"
      });
      expect(onCreate).toHaveBeenCalledTimes(1);
    });
    it("should not create form is exists", async () => {
      const {service, formioService} = await createServiceFixture();
      const onCreate = vi.fn();
      const form: any = {
        name: "name"
      };

      formioService.mongoose.models.form.countDocuments.mockResolvedValue(true);
      formioService.mongoose.models.form.exec.mockResolvedValue({
        _id: "id",
        name: "name"
      });

      const result = await service.importFormIfNotExists(form, onCreate);

      expect(result).toEqual({
        _id: "id",
        name: "name"
      });
    });
  });
  describe("getSubmissions()", () => {
    it("should return submissions", async () => {
      const {service} = await createServiceFixture();

      const result = await service.getSubmissions();

      expect(result).toEqual([]);
      expect(service.submissionModel.find).toHaveBeenCalledWith({deleted: {$eq: null}});
    });
    it("should return submissions with query", async () => {
      const {service} = await createServiceFixture();

      const result = await service.getSubmissions({
        form: "id"
      });

      expect(result).toEqual([]);
      expect(service.submissionModel.find).toHaveBeenCalledWith({deleted: {$eq: null}, form: "id"});
    });
  });
  describe("saveSubmissions()", () => {
    it("should create submission", async () => {
      const {service} = await createServiceFixture();

      const result = await service.saveSubmission({
        data: {}
      });

      expect(result).toEqual({
        _id: "newID",
        data: {}
      });
      expect(service.submissionModel.findOneAndUpdate).toHaveBeenCalledWith(
        {_id: "newID"},
        {_id: "newID", data: {}},
        {
          new: true,
          upsert: true
        }
      );
    });
    it("should update submission", async () => {
      const {service} = await createServiceFixture();

      const result = await service.saveSubmission({
        _id: "id",
        data: {}
      });

      expect(result).toEqual({
        _id: "id",
        data: {}
      });
      expect(service.submissionModel.findOneAndUpdate).toHaveBeenCalledWith(
        {_id: "id"},
        {
          _id: "id",
          data: {}
        },
        {new: true, upsert: true}
      );
    });
  });
  describe("importSubmission()", () => {
    it("should import submission", async () => {
      const {service} = await createServiceFixture();

      vi.spyOn(service, "saveSubmission").mockResolvedValue({} as any);

      const result = await service.importSubmission({
        _id: "id",
        data: {}
      });

      expect(result).toEqual({});
      expect(service.saveSubmission).toHaveBeenCalledWith({_id: "id", data: {}});
    });
  });
  describe("getForm", () => {
    it("should return form from id", async () => {
      const {service, formioService} = await createServiceFixture();

      await service.getForm("605f0d40fe971372e448bcad");

      expect(formioService.mongoose.models.form.findOne).toHaveBeenCalledWith({
        _id: "605f0d40fe971372e448bcad",
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.form.lean).toHaveBeenCalledWith();
      expect(formioService.mongoose.models.form.exec).toHaveBeenCalledWith();
    });

    it("should return form from machineName", async () => {
      const {service, formioService} = await createServiceFixture();

      await service.getForm("name");

      expect(formioService.mongoose.models.form.findOne).toHaveBeenCalledWith({
        name: {$eq: "name"},
        deleted: {$eq: null}
      });
      expect(formioService.mongoose.models.form.lean).toHaveBeenCalledWith();
      expect(formioService.mongoose.models.form.exec).toHaveBeenCalledWith();
    });
  });
  describe("idToBson", () => {
    beforeEach(() => {});
    it("should convert id", async () => {
      const {service, formioService} = await createServiceFixture();
      formioService.util.idToBson.mockReturnValue({bson: "bson"});
      expect(service.idToBson("id")).toEqual({bson: "bson"});
      expect(service.idToBson(["id"])).toEqual({$in: [{bson: "bson"}]});
      expect(service.idToBson({_id: "id"})).toEqual({bson: "bson"});
      expect(service.idToBson()).toEqual(undefined);
    });
  });
});
