import {EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import {Returns} from "./returns";

class Test {}

describe("Returns()", () => {
  describe("when status and configuration are given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @Returns(400, {
          description: "Bad Request"
        })
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.responses.get(400)).to.deep.eq({
        code: 400,
        description: "Bad Request"
      });
    });
  });

  describe("when status and model are given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @Returns(200, Test)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.responses.get(200)).to.deep.eq({
        code: 200,
        description: "",
        type: Test
      });
    });
  });

  describe("when a type and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Returns(Test, {
          description: "Success"
        })
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "Success",
        type: Test
      });
    });
  });

  describe("when a type is given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @Returns(Test)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "",
        type: Test
      });
    });
  });

  describe("when a configuration is given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @Returns({
          description: "Success",
          type: Test,
          headers: {
            "Content-Type": {
              type: "string"
            }
          }
        })
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.response).to.deep.eq({
        code: 200,
        description: "Success",
        type: Test,
        headers: {
          "Content-Type": {
            type: "string"
          }
        }
      });
    });
  });
});
