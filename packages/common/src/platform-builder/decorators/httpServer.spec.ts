import {HttpServer} from "@tsed/common";
import {classOf} from "@tsed/core";
import {expect} from "chai";

describe("HttpServer", () => {
  it("should inject HttpServer", () => {
    class MyModule {
      constructor(@HttpServer public http: HttpServer) {}
    }

    // @ts-ignore
    expect(MyModule).to.be.a("function");
  });
});
