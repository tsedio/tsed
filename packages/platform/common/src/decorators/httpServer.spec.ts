import {HttpServer} from "@tsed/common";

describe("HttpServer", () => {
  it("should inject HttpServer", () => {
    class MyModule {
      constructor(@HttpServer public http: HttpServer) {}
    }

    // @ts-ignore
    expect(MyModule).toBeInstanceOf(Function);
  });
});
