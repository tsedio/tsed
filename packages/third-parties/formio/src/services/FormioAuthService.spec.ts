import {catchAsyncError} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioAuthService} from "./FormioAuthService.js";
import {FormioHooksService} from "./FormioHooksService.js";
import {FormioService} from "./FormioService.js";

function createSubmissionModelFixture(): any {
  return class {
    static findOne = vi.fn().mockReturnThis();
    static updateOne = vi.fn().mockResolvedValue({});
    static lean = vi.fn().mockReturnThis();
    static exec = vi.fn().mockReturnThis();
    save = vi.fn().mockReturnThis();

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
    static findOne = vi.fn().mockReturnThis();
    static lean = vi.fn().mockReturnThis();
    static exec = vi.fn();
  };
}

function createRoleModelFixture(): any {
  return class {
    static find = vi.fn().mockReturnThis();
    static sort = vi.fn().mockReturnThis();
    static lean = vi.fn().mockReturnThis();
    static exec = vi.fn().mockResolvedValue({});
  };
}

async function createServiceFixture() {
  const formioService = {
    audit: vi.fn(),
    auth: {
      tempToken: vi.fn(),
      logout: vi.fn(),
      currentUser: vi.fn().mockImplementation((req, res, next) => next()),
      getToken: vi.fn().mockReturnValue("auth_token")
    },
    mongoose: {
      models: {
        submission: createSubmissionModelFixture(),
        form: createFormModelFixture(),
        role: createRoleModelFixture()
      }
    },
    util: {
      idToBson: vi.fn().mockImplementation((f) => f),
      errorCodes: {
        role: {EROLESLOAD: "EROLESLOAD"}
      }
    }
  };

  const formioHooksService = {
    alter: vi.fn().mockImplementation((event: string, value: any) => value),
    alterAsync: vi.fn().mockImplementation((event: string, value: any) => Promise.resolve(value))
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

  describe("createUser()", () => {
    it("should create a user submission", async () => {
      const {service} = await createServiceFixture();

      const submission = await service.createUser({
        form: "formId",
        data: {
          fullname: "fullname"
        }
      });

      expect(submission.form).toEqual("formId");
      expect(submission.data).toEqual({
        fullname: "fullname"
      });
    });
  });
  describe("updateUser()", () => {
    it("should update a user submission", async () => {
      const {service, formioService} = await createServiceFixture();

      const result = await service.updateUser({
        _id: "id",
        form: "formId",
        data: {
          fullname: "fullname"
        }
      });

      expect(result).toEqual({
        _id: "id",
        form: "formId",
        data: {
          fullname: "fullname"
        }
      });
      expect(formioService.mongoose.models.submission.updateOne).toHaveBeenCalledWith(
        {_id: "id"},
        {$set: {_id: "id", data: {fullname: "fullname"}, form: "formId"}}
      );
    });
  });
  describe("getRoles()", () => {
    it("should return all formio roles", async () => {
      const {service, formioService} = await createServiceFixture();

      formioService.mongoose.models.role.exec.mockResolvedValue([{name: "administrator"}]);

      const roles = await service.getRoles({} as any);

      expect(roles).toEqual([{name: "administrator"}]);
      expect(formioService.mongoose.models.role.find).toHaveBeenCalledWith({deleted: {$eq: null}});
      expect(formioService.mongoose.models.role.sort).toHaveBeenCalledWith({title: 1});
      expect(formioService.mongoose.models.role.lean).toHaveBeenCalledWith();
    });

    it("should throw an error", async () => {
      const {service, formioService} = await createServiceFixture();

      vi.mocked(formioService.mongoose.models.role.exec).mockRejectedValue(new Error("test"));

      const error = await catchAsyncError(() => service.getRoles({} as any));
      expect(error).toBeInstanceOf(BadRequest);
      expect(error?.message).toEqual("EROLESLOAD");
    });
  });
  describe("updateUserRole()", () => {
    it("should update the role associated to the submission", async () => {
      const {service, formioService, formioHooksService} = await createServiceFixture();
      const submission = {
        _id: "submissionId",
        save: vi.fn()
      };

      formioService.mongoose.models.submission.exec = vi.fn().mockResolvedValue(submission);

      const user = await service.updateUserRole("submissionId", "roleId", {} as any);

      expect(formioHooksService.alter).toHaveBeenCalledWith("submissionQuery", {_id: "submissionId", deleted: {$eq: null}}, {});
      expect(formioService.mongoose.models.submission.findOne).toHaveBeenCalledWith({_id: "submissionId", deleted: {$eq: null}});
      expect(user.save).toHaveBeenCalledWith();
      expect(user.roles).toEqual(["roleId"]);
    });

    it("should update the role associated to the submission without save", async () => {
      const {service, formioService, formioHooksService} = await createServiceFixture();
      const submission = {
        _id: "submissionId"
      };

      formioService.mongoose.models.submission.exec = vi.fn().mockResolvedValue(submission);

      const user = await service.updateUserRole("submissionId", "roleId", {} as any);

      expect(formioHooksService.alter).toHaveBeenCalledWith("submissionQuery", {_id: "submissionId", deleted: {$eq: null}}, {});
      expect(formioService.mongoose.models.submission.findOne).toHaveBeenCalledWith({_id: "submissionId", deleted: {$eq: null}});
      expect(user.roles).toEqual(["roleId"]);
    });
    it("should throw an error when submission doesn't exists", async () => {
      const {service, formioService} = await createServiceFixture();

      formioService.mongoose.models.submission.exec = vi.fn().mockResolvedValue(null);

      const error = await catchAsyncError(() => service.updateUserRole("submissionId", "roleId", {} as any));

      expect(error).toBeInstanceOf(BadRequest);
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

      expect(ctx.getRequest().submission).toEqual({data: {}});
      expect(ctx.getRequest().user).toEqual({_id: "id", data: {}});
      expect(ctx.getRequest().token).toEqual({
        form: {
          _id: "id"
        },
        user: {
          _id: "id"
        }
      });
      expect(ctx.getResponse().token).toEqual("token");
      expect(ctx.getRequest()["x-jwt-token"]).toEqual("token");
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

      formioService.mongoose.models.form.exec.mockResolvedValue(form);

      const result = await service.generatePayloadToken(user as any, ctx);

      expect(result).toEqual({
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
      expect(formioHooksService.alter).toHaveBeenCalledWith("token", payload, form, ctx.getRequest());
      expect(formioHooksService.alter).toHaveBeenCalledWith("tokenDecode", payload, ctx.getRequest());
      expect(formioHooksService.alterAsync).toHaveBeenCalledWith("user", user);
      expect(formioHooksService.alterAsync).toHaveBeenCalledWith("login", user, ctx.getRequest());
    });
    it("should throw error when the getForm throw error", async () => {
      const {service, formioService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      formioService.mongoose.models.form.exec.mockRejectedValue(new Error("message"));

      const error = await catchAsyncError(() => service.generatePayloadToken(user as any, ctx));

      expect(error?.name).toEqual("Error");
      expect(formioService.audit).toHaveBeenCalledWith(
        "EAUTH_USERFORM",
        {...ctx.request.raw, userId: user._id},
        "605f0d40fe971372e448bcad",
        error
      );
    });
    it("should throw error when the form isn't found", async () => {
      const {service, formioService} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      formioService.mongoose.models.form.exec.mockResolvedValue(null);

      const error = await catchAsyncError(() => service.generatePayloadToken(user as any, ctx));

      expect(error?.name).toEqual("NOT_FOUND");
      expect(formioService.audit).toHaveBeenCalledWith(
        "EAUTH_USERFORM",
        {...ctx.request.raw, userId: user._id},
        "605f0d40fe971372e448bcad",
        {
          message: "User form not found"
        }
      );
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

      vi.spyOn(service, "setCurrentUser").mockReturnValue(undefined as any);
      vi.spyOn(service, "generatePayloadToken").mockResolvedValue({
        user,
        token: {
          token: "token"
        }
      } as any);

      await service.generateSession(user as any, ctx);

      expect(service.setCurrentUser).toHaveBeenCalledWith(
        user,
        {
          token: "token"
        },
        ctx
      );
      expect(service.setCurrentUser).toHaveBeenCalledWith(
        user,
        {
          token: "token"
        },
        ctx
      );
      expect(formioService.auth.currentUser).toHaveBeenCalledWith(ctx.getRequest(), ctx.getResponse(), expect.any(Function));
    });
    it("should throw an error when an action isn't permitted", async () => {
      const {service} = await createServiceFixture();
      const ctx = PlatformTest.createRequestContext();
      const user = {
        _id: "id",
        form: "605f0d40fe971372e448bcad",
        data: {}
      };

      vi.spyOn(service, "setCurrentUser").mockReturnValue(undefined as any);
      vi.spyOn(service, "generatePayloadToken").mockRejectedValue(new Error("Not found"));

      const error = await catchAsyncError(() => service.generateSession(user as any, ctx));
      expect(error?.message).toEqual("Not found");
    });
  });
  describe("tempToken()", () => {
    it("should return tempToken", async () => {
      const {service, formioService} = await createServiceFixture();

      expect(service.tempToken).toEqual(formioService.auth.tempToken);
    });
  });
  describe("logout()", () => {
    it("should return logout", async () => {
      const {service, formioService} = await createServiceFixture();

      expect(service.logout).toEqual(formioService.auth.logout);
    });
  });
});
