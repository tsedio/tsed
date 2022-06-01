import {HttpServer, HttpsServer} from "@tsed/common";

describe("HttpServer", () => {
  it("should inject HttpServer", () => {
    class MyModule {
      constructor(@HttpsServer public http: HttpsServer) {}
    }

    // @ts-ignore
    expect(MyModule).toBeInstanceOf(Function);
  });
});
