import {EndpointMetadata} from "@tsed/common";
import {FormioAuthMiddleware, UseFormioAuth} from "@tsed/formio";

describe("UseFormioAuth", () => {
  it("should add auth on method", () => {
    class MyClass {
      @UseFormioAuth()
      get() {}
    }

    expect(EndpointMetadata.get(MyClass, "get").beforeMiddlewares[0]).toEqual(FormioAuthMiddleware);
  });
});
