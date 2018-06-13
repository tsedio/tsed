import {parseSwaggerPath} from "../../../../src/swagger/utils";
import {expect} from "../../../tools";

describe("parseSwaggerPath()", () => {
  it("should return params and path(1)", () => {
    expect(parseSwaggerPath("/rest/", "/get/:path1/:path2?")).to.deep.eq([
      {
        path: "/rest/get/{path1}",
        pathParams: [
          {
            in: "path",
            name: "path1",
            required: true,
            type: "string"
          }
        ]
      },
      {
        path: "/rest/get/{path1}/{path2}",
        pathParams: [
          {
            in: "path",
            name: "path1",
            required: true,
            type: "string"
          },
          {
            in: "path",
            name: "path2",
            required: true,
            type: "string"
          }
        ]
      }
    ]);
  });

  it("should return params and path(2)", () => {
    expect(parseSwaggerPath("/rest/", "/get/:path1/:path2")).to.deep.eq([
      {
        path: "/rest/get/{path1}/{path2}",
        pathParams: [
          {
            in: "path",
            name: "path1",
            required: true,
            type: "string"
          },
          {
            in: "path",
            name: "path2",
            required: true,
            type: "string"
          }
        ]
      }
    ]);
  });

  it("should return params and path(2)", () => {
    expect(parseSwaggerPath("/rest/", "/get/path1/path2")).to.deep.eq([
      {
        path: "/rest/get/path1/path2",
        pathParams: []
      }
    ]);
  });

  it("should return params and path(3)", () => {
    expect(parseSwaggerPath("/rest/calendar/", "/")).to.deep.eq([
      {
        path: "/rest/calendar",
        pathParams: []
      }
    ]);
  });
});
