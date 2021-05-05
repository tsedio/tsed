import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {FormioService} from "@tsed/formio";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioAuthService} from "./FormioAuthService";
import {FormioHooksService} from "./FormioHooksService";

const sandbox = Sinon.createSandbox();

function createSubmissionModelFixture(): any {
  return class {
    static findOne = sandbox.stub().returnsThis();
    static updateOne = sandbox.stub().resolves({});
    static lean = sandbox.stub().returnsThis();
    static exec = sandbox.stub().returnsThis();
    save = sandbox.stub().returnsThis();

    constructor(public ctrOptions: any) {}

    get form(): string {
      return this.ctrOptions.form;
    }

    set form(form: string) {
      this.ctrOptions.form = form;
    }

    toObject() {
      return this.ctrOptions;
    }
  };
}

function createFormModelFixture(): any {
  return class {
    static findOne = sandbox.stub().returnsThis();
    static lean = sandbox.stub().returnsThis();
    static exec = sandbox.stub();
  };
}

function createRoleModelFixture(): any {
  return class {
    static find = sandbox.stub().returnsThis();
    static sort = sandbox.stub().returnsThis();
    static lean = sandbox.stub().returnsThis();
    static exec = sandbox.stub().resolves({});
  };
}

async function createServiceFixture() {
  const formioService = {
    audit: sandbox.stub(),
    auth: {
      tempToken: sandbox.stub(),
      logout: sandbox.stub(),
      currentUser: sandbox.stub().callsFake((req, res, next) => next()),
      getToken: sandbox.stub().returns("auth_token")
    },
    mongoose: {
      models: {
        submission: createSubmissionModelFixture(),
        form: createFormModelFixture(),
        role: createRoleModelFixture()
      }
    },
    util: {
      idToBson: sandbox.stub().callsFake((f) => f),
      errorCodes: {
        role: {EROLESLOAD: "EROLESLOAD"}
      }
    }
  };

  const formioHooksService = {
    alter: sandbox.stub().callsFake((event: string, value: any) => value),
    alterAsync: sandbox.stub().callsFake((event: string, value: any) => Promise.resolve(value))
  };

  const service = await PlatformTest.invoke<FormioAuthService>(FormioAuthService, [
    {
      token: FormioService,
      use: formioService
    },
    {
      token: FormioHooksService,
      use: formioHooksService
    }
  ]);

  return {service, formioService, formioHooksService};
}

describe("FormioAuthService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  describe("createUser()", () => {
    it("should create a user submission", async () => {
      const {service} = await createServiceFixture();

      const submission = await service.createUser({
        form: "formId",
        data: {
          fullname: "fullname"
        }
      });

      expect(submission.form).to.deep.equal("formId");
      expect(submission.data).to.deep.equal({
        fullname: "fullname"
      });
    });
  });
  describe("updateUser()", () => {
    it("should update a user submission", async () => {
      const {service, formioService} = await createServiceFixture();

      await service.updateUser({
        _id: "id",
        form: "formId",
        data: {
          fullname: "fullname"
        }
      });

      expect(formioService.mongoose.models.submission.updateOne).to.have.been.calledWithExactly(
        {_id: "id"},
        {$set: {_id: "id", data: {fullname: "fullname"}, form: "formId"}}
      );
    });
  });
  describe("getRoles()", () => {
    it("should return all formio roles", async () => {
      const {service, formioService} = await createServiceFixture();

      formioService.mongoose.models.role.exec.resolves([{name: "administrator"}]);

      const roles = await service.getRoles({} as any);

      expect(roles).to.deep.eq([{name: "administrator"}]);
      expect(formioService.mongoose.models.role.find).to.have.been.calledWithExactly({deleted: {$eq: null}});
      expect(formioService.mongoose.models.role.sort).to.have.been.calledWithExactly({title: 1});
      expect(formioService.mongoose.models.role.lean).to.have.been.calledWithExactly();
    });

    it("should throw an error", async () => {
      const {service, formioService} = await createServiceFixture();

      formioService.mongoose.models.role.exec.rejects(new Error("test"));

      const error = await catchAsyncError(() => service.getRoles({} as any));
      expect(error).to.be.instanceof(BadRequest);
      expect(error?.message).to.eq("EROLESLOAD");
    });
  });
  describe("updateUserRole()", () => {
    it("should update the role associated to the submission", async () => {
      const {service, formioService, formioHooksService} = await createServiceFixture();
      const submission = {
        _id: "submissionId",
        save: sandbox.stub()
      };

      formioService.mongoose.models.submission.exec = sandbox.stub().resolves(submission);

      const user = await service.updateUserRole("submissionId", "roleId", {} as any);

      expect(formioHooksService.alter).to.have.been.calledWithExactly("submissionQuery", {_id: "submissionId", deleted: {$eq: null}}, {});
      expect(formioService.mongoose.models.submission.findOne).to.have.been.calledWithExactly({_id: "submissionId", deleted: {$eq: null}});
      expect(user.save).to.have.been.calledWithExactly();
      expect(user.roles).to.deep.eq(["roleId"]);
    });

    it("should update the role associated to the submission without save", async () => {
      const {service, formioService, formioHooksService} = await createServiceFixture();
      const submission = {
        _id: "submissionId"
      };

      formioService.mongoose.models.submission.exec = sandbox.stub().resolves(submission);

      const user = await service.updateUserRole("submissionId", "roleId", {} as any);

      expect(formioHooksService.alter).to.have.been.calledWithExactly("submissionQuery", {_id: "submissionId", deleted: {$eq: null}}, {});
      expect(formioService.mongoose.models.submission.findOne).to.have.been.calledWithExactly({_id: "submissionId", deleted: {$eq: null}});
      expect(user.roles).to.deep.eq(["roleId"]);
    });
    it("should throw an error when submission doesn't exists", async () => {
      const {service, formioService} = await createServiceFixture();

      formioService.mongoose.models.submission.exec = sandbox.stub().resolves(null);

      const error = await catchAsyncError(() => service.updateUserRole("submissionId", "roleId", {} as any));

      expect(error).to.be.instanceof(BadRequest);
    });
  });
  describe("setCurrentUser()", () => {
    it("should set current user", async () => {
      const {service} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      ctx.getRequest().submission = {};
      const user = {
        _id: "id",
        data: {}
      };

      const token = {
        decoded: {
          form: {
            _id: "id"
          },
          user: {
            _id: "id"
          }
        },
        token: "token"
      };

      service.setCurrentUser(user as any, token, ctx);

      expect(ctx.getRequest().submission).to.deep.eq({data: {}});
      expect(ctx.getRequest().user).to.deep.eq({_id: "id", data: {}});
      expect(ctx.getRequest().token).to.deep.eq({
        form: {
          _id: "id"
        },
        user: {
          _id: "id"
        }
      });
      expect(ctx.getResponse().token).to.deep.eq("token");
      expect(ctx.getRequest()["x-jwt-token"]).to.deep.eq("token");
    });
  });
  describe("generatePayloadToken()", () => {
    it("should return the payload token", async () => {
      const {service, formioService, formioHooksService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };
      const form = {
        _id: "605f0d40fe971372e448bcad"
      };

      const payload = {
        user: {
          _id: user._id
        },
        form: {
          _id: form._id
        }
      };

      formioService.mongoose.models.form.exec.resolves(form);

      const result = await service.generatePayloadToken(user as any, ctx);

      expect(result).to.deep.eq({
        token: {
          decoded: payload,
          token: "auth_token"
        },
        user: {
          _id: "id",
          data: {},
          form: "605f0d40fe971372e448bcad"
        }
      });
      expect(formioHooksService.alter).to.have.been.calledWithExactly("token", payload, form, ctx.getRequest());
      expect(formioHooksService.alter).to.have.been.calledWithExactly("tokenDecode", payload, ctx.getRequest());
      expect(formioHooksService.alterAsync).to.have.been.calledWithExactly("user", user);
      expect(formioHooksService.alterAsync).to.have.been.calledWithExactly("login", user, ctx.getRequest());
    });
    it("should throw error when the getForm throw error", async () => {
      const {service, formioService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      formioService.mongoose.models.form.exec.rejects(new Error("message"));

      const error = await catchAsyncError(() => service.generatePayloadToken(user as any, ctx));

      expect(error?.name).to.deep.eq("Error");
      expect(formioService.audit).to.have.been.calledWithExactly("EAUTH_USERFORM", {userId: "id"}, "605f0d40fe971372e448bcad", error);
    });
    it("should throw error when the form isn't found", async () => {
      const {service, formioService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      formioService.mongoose.models.form.exec.resolves(null);

      const error = await catchAsyncError(() => service.generatePayloadToken(user as any, ctx));

      expect(error?.name).to.deep.eq("NOT_FOUND");
      expect(formioService.audit).to.have.been.calledWithExactly("EAUTH_USERFORM", {userId: "id"}, "605f0d40fe971372e448bcad", {
        message: "User form not found"
      });
    });
  });
  describe("generateSession()", () => {
    it("should generate session", async () => {
      const {service, formioService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      sandbox.stub(service, "setCurrentUser").returns(undefined as any);
      sandbox.stub(service, "generatePayloadToken").resolves({
        user,
        token: {
          token: "token"
        }
      } as any);

      await service.generateSession(user as any, ctx);

      expect(service.setCurrentUser).to.have.been.calledWithExactly(
        user,
        {
          token: "token"
        },
        ctx
      );
      expect(service.setCurrentUser).to.have.been.calledWithExactly(
        user,
        {
          token: "token"
        },
        ctx
      );
      expect(formioService.auth.currentUser).to.have.been.calledWithExactly(ctx.getRequest(), ctx.getResponse(), Sinon.match.func);
    });
    it("should throw an error when an action isn't permitted", async () => {
      const {service} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      sandbox.stub(service, "setCurrentUser").returns(undefined as any);
      sandbox.stub(service, "generatePayloadToken").rejects(new Error("Not found"));

      const error = await catchAsyncError(() => service.generateSession(user as any, ctx));
      expect(error?.message).to.equal("Not found");
    });
  });
  describe("tempToken()", () => {
    it("should return tempToken", async () => {
      const {service, formioService} = await createServiceFixture();

      expect(service.tempToken).to.deep.eq(formioService.auth.tempToken);
    });
  });
  describe("logout()", () => {
    it("should return logout", async () => {
      const {service, formioService} = await createServiceFixture();

      expect(service.logout).to.deep.eq(formioService.auth.logout);
    });
  });
});
