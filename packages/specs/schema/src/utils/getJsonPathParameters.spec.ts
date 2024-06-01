import {getJsonPathParameters} from "./getJsonPathParameters.js";

describe("getJsonPathParameters", () => {
  it("should return params and path(1)", () => {
    expect(getJsonPathParameters("/rest/", "/get/:path1/:path2?")).toEqual([
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
    expect(getJsonPathParameters("/rest/", "/get/:path1/:path2")).toEqual([
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
    expect(getJsonPathParameters("/rest/", "/get/path1/path2")).toEqual([
      {
        path: "/rest/get/path1/path2",
        parameters: []
      }
    ]);
  });
  it("should return params and path(4)", () => {
    expect(getJsonPathParameters("/rest/calendar/", "/")).toEqual([
      {
        path: "/rest/calendar",
        parameters: []
      }
    ]);
  });
  it("should return params and path /file/:filename.json", () => {
    expect(getJsonPathParameters("/rest/", "/file/:filename.json")).toEqual([
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
    expect(getJsonPathParameters("/rest/", "/category/:category([a-zA-Z/_-]+).json")).toEqual([
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
  it("should return params and path /path/JQ=:id", () => {
    expect(getJsonPathParameters("/rest/", "/path/JQ=:id")).toEqual([
      {
        path: "/rest/path/JQ={id}",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "string"
          }
        ]
      }
    ]);
  });
  it("should return params and path regexp", () => {
    expect(getJsonPathParameters("/rest/", /\*json$/)).toEqual([
      {
        parameters: [],
        path: "/rest/*json$"
      }
    ]);
  });
});
