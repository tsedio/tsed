import {EndpointMetadata} from "@tsed/common/src";
import {expect} from "chai";
import {ReturnsArray} from "../index";

class Test {}

describe("ReturnsArray()", () => {
  describe("when a type and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray(Test, {
          description: "Success",
        })
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "Success",
        type: Test,
        collectionType: Array,
      });
    });
  });

  describe("when a type is given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray(Test)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "",
        type: Test,
        collectionType: Array,
      });
    });
  });

  describe("when a configuration is given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray({
          description: "Success",
          type: Test,
          headers: {
            "Content-Type": {
              type: "string",
            },
          },
        })
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "Success",
        type: Test,
        collectionType: Array,
        headers: {
          "Content-Type": {
            type: "string",
          },
        },
      });
    });
  });
});
