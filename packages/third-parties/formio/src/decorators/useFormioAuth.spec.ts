import {EndpointMetadata} from "@tsed/common";

import {FormioAuthMiddleware} from "../middlewares/FormioAuthMiddleware.js";
import {UseFormioAuth} from "./useFormioAuth.js";

describe("UseFormioAuth", () => {
  it("should add auth on method", () => {
    class MyClass {
      @UseFormioAuth()
      get() {}
    }

    expect(EndpointMetadata.get(MyClass, "get").beforeMiddlewares[0]).toEqual(FormioAuthMiddleware);
  });
});
