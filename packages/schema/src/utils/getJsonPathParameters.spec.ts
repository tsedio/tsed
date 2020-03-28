import {expect} from "chai";
import {getJsonPathParameters} from "./getJsonPathParameters";

describe("getJsonPathParameters", () => {
  it("should return params and path(1)", () => {
    expect(getJsonPathParameters("/rest/", "/get/:path1/:path2?")).to.deep.eq([
      {
        path: "/rest/get/{path1}",
        parameters: [
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
        parameters: [
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
    expect(getJsonPathParameters("/rest/", "/get/:path1/:path2")).to.deep.eq([
      {
        path: "/rest/get/{path1}/{path2}",
        parameters: [
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
    expect(getJsonPathParameters("/rest/", "/get/path1/path2")).to.deep.eq([
      {
        path: "/rest/get/path1/path2",
        parameters: []
      }
    ]);
  });
  it("should return params and path(4)", () => {
    expect(getJsonPathParameters("/rest/calendar/", "/")).to.deep.eq([
      {
        path: "/rest/calendar",
        parameters: []
      }
    ]);
  });
  it("should return params and path /file/:filename.json", () => {
    expect(getJsonPathParameters("/rest/", "/file/:filename.json")).to.deep.eq([
      {
        path: "/rest/file/{filename}.json",
        parameters: [
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
    expect(getJsonPathParameters("/rest/", "/category/:category([a-zA-Z/_-]+).json")).to.deep.eq([
      {
        path: "/rest/category/{category}.json",
        parameters: [
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
  it("should return params and path regexp", () => {
    expect(getJsonPathParameters("/rest/", /\*json$/)).to.deep.eq([
      {
        parameters: [],
        path: "/rest/*json$"
      }
    ]);
  });
});
