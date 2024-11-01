import {Store} from "@tsed/core";
import {Controller, inject} from "@tsed/di";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {Get, getSpec} from "@tsed/schema";

import {Authorize, PassportMiddleware} from "../index.js";

@Middleware()
class AuthoriseBucket {
  use() {}
}

describe("@Authorize", () => {
  it("should store data", () => {
    class Test {
      @Authorize("local", {
        security: {
          test: ["scope"]
        }
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).toEqual({
      method: "authorize",
      options: {
        security: {
          test: ["scope"]
        }
      },
      originalUrl: true,
      protocol: "local"
    });
  });
  it("should store data (without originalUrl)", () => {
    class Test {
      @Authorize("local", {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).toEqual({
      method: "authorize",
      options: {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      },
      originalUrl: false,
      protocol: "local"
    });
  });
  it("should support inheritance", async () => {
    abstract class AbstractAdminController {
      @Get("/allEntries")
      getAllEntries(): Promise<unknown> {
        return Promise.resolve({});
      }
    }

    @Authorize("loginAuthProvider")
    @Controller("/admin")
    class AdminController extends AbstractAdminController {}

    @Controller("/admin/bucket")
    @UseBefore(AuthoriseBucket)
    class BucketAdminController extends AbstractAdminController {}

    expect(getSpec(AdminController)).toMatchSnapshot();
    expect(getSpec(BucketAdminController)).toMatchSnapshot();
    expect(Reflect.getOwnPropertyDescriptor(AdminController.prototype, "getAllEntries")).toBeDefined();
    expect(Reflect.getOwnPropertyDescriptor(BucketAdminController.prototype, "getAllEntries")).not.toBeDefined();

    const adminController = inject(AdminController);

    expect(await adminController.getAllEntries()).toEqual({});

    expect(Store.fromMethod(BucketAdminController, "getAllEntries").get(PassportMiddleware)).toEqual(undefined);
    expect(Store.fromMethod(AbstractAdminController, "getAllEntries").get(PassportMiddleware)).toEqual(undefined);
    expect(Store.fromMethod(AdminController, "getAllEntries").get(PassportMiddleware)).toEqual({
      method: "authorize",
      options: {},
      originalUrl: true,
      protocol: "loginAuthProvider"
    });
  });
});
