import {expect} from "chai";
import {EndpointMetadata} from "../../../../src/mvc";
import {Header, mapHeaders} from "./header";

describe("mapHeaders", () => {
  it("should map headers", () => {
    expect(
      mapHeaders({
        header1: 1,
        header2: "content",
        header3: {
          value: "content2",
          type: "string"
        }
      } as any)
    ).to.deep.eq({
      header1: {value: 1, type: "number"},
      header2: {value: "content", type: "string"},
      header3: {
        value: "content2",
        type: "string"
      }
    });
  });
});

describe("Header", () => {
  describe("when is used as method decorator", () => {
    describe("with one params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header({"Content-Type": "application/json"})
          test() {
          }
        }

        const endpoint = EndpointMetadata.get(MyController, "test");

        expect(endpoint.response).to.deep.eq({
          code: 200,
          headers: {
            "Content-Type": {
              type: "string",
              value: "application/json"
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

        const endpoint = EndpointMetadata.get(MyController, "test");

        expect(endpoint.response).to.deep.eq({
          code: 200,
          headers: {
            "Content-Type": {
              type: "string",
              value: "application/json"
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
          } as any)
          test() {
          }
        }

        const endpoint = EndpointMetadata.get(MyController, "test");

        expect(endpoint.response).to.deep.eq({
          code: 200,
          headers: {
            "Content-Length": {
              type: "number",
              value: 123
            },
            "Content-Type": {
              type: "string",
              value: "text/plain"
            },
            ETag: {
              description: "header description",
              type: "string",
              value: "12345"
            }
          }
        });
      });
    });
  });
});
