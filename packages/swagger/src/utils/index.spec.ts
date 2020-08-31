import {expect} from "chai";
import {parseSwaggerPath} from "./index";

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

  it("should return params and path(3)", () => {
    expect(parseSwaggerPath("/rest/", "/get/path1/path2")).to.deep.eq([
      {
        path: "/rest/get/path1/path2",
        pathParams: []
      }
    ]);
  });

  it("should return params and path(4)", () => {
    expect(parseSwaggerPath("/rest/calendar/", "/")).to.deep.eq([
      {
        path: "/rest/calendar",
        pathParams: []
      }
    ]);
  });
  it("should return params and path /file/:filename.json", () => {
    expect(parseSwaggerPath("/rest/", "/file/:filename.json")).to.deep.eq([
      {
        path: "/rest/file/{filename}.json",
        pathParams: [
          {
            in: "path",
            name: "filename",
            required: true,
            type: "string"
          }
        ]
      }
    ]);
  });

  it("should return params and path /category/:category([a-zA-Z/_-]+).json", () => {
    expect(parseSwaggerPath("/rest/", "/category/:category([a-zA-Z/_-]+).json")).to.deep.eq([
      {
        path: "/rest/category/{category}.json",
        pathParams: [
          {
            in: "path",
            name: "category",
            required: true,
            type: "string"
          }
        ]
      }
    ]);
  });
});
