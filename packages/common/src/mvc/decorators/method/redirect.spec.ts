import {EndpointMetadata, Redirect} from "@tsed/common";
import {expect} from "chai";

describe("Redirect", () => {
  describe("with one parameter", () => {
    it("should store redirect configuration", () => {
      class Test {
        @Redirect("/test")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      expect(endpoint.redirect).to.deep.equal({status: 302, url: "/test"});
    });
  });
  describe("with two parameter", () => {
    it("should store redirect configuration", () => {
      class Test {
        @Redirect(301, "/test")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      expect(endpoint.redirect).to.deep.equal({status: 301, url: "/test"});
    });
  });
});
