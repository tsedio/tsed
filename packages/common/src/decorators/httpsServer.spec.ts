import {HttpServer, HttpsServer} from "@tsed/common";
import {expect} from "chai";

describe("HttpServer", () => {
  it("should inject HttpServer", () => {
    class MyModule {
      constructor(@HttpsServer public http: HttpsServer) {}
    }

    // @ts-ignore
    expect(MyModule).to.be.a("function");
  });
});
