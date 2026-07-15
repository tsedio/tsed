import {s} from "@tsed/schema";

import {FormioAuthMiddleware} from "../middlewares/FormioAuthMiddleware.js";
import {UseFormioAuth} from "./useFormioAuth.js";

describe("UseFormioAuth", () => {
  it("should add auth on method", () => {
    class MyClass {
      @UseFormioAuth()
      get() {}
    }

    expect(s.store.method(MyClass, "get").beforeMiddlewares[0]).toEqual(FormioAuthMiddleware);
  });
});
