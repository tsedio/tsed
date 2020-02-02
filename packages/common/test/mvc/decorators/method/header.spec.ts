import {EndpointRegistry} from "../../../../src/mvc";
import {Header} from "../../../../src/mvc/decorators";

describe("Header", () => {
  describe("when is used as method decorator", () => {
    describe("with one params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header({"Content-Type": "application/json"})
          test() {

          }
        }

        const endpoint = EndpointRegistry.get(MyController, "test");

        endpoint.response.should.deep.eq({
          "code": 200,
          "headers": {
            "Content-Type": {
              "type": "string",
              "value": "application/json"
            }
          }
        });
      });
    });
    describe("with two params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header("Content-Type", "application/json")
          test() {

          }
        }

        const endpoint = EndpointRegistry.get(MyController, "test");

        endpoint.response.should.deep.eq({
          "code": 200,
          "headers": {
            "Content-Type": {
              "type": "string",
              "value": "application/json"
            }
          }
        });
      });
    });
    describe("with swagger params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header({
            "Content-Type": "text/plain",
            "Content-Length": 123,
            ETag: {
              value: "12345",
              description: "header description"
            }
          })
          test() {

          }
        }

        const endpoint = EndpointRegistry.get(MyController, "test");

        endpoint.response.should.deep.eq({
          "code": 200,
          "headers": {
            "Content-Length": {
              "type": "number",
              "value": 123
            },
            "Content-Type": {
              "type": "string",
              "value": "text/plain"
            },
            "ETag": {
              "description": "header description",
              "type": "string",
              "value": "12345"
            }
          }
        });
      });
    });
  });
});
