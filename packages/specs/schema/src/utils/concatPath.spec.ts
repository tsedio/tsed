import {concatPath} from "./concatPath";

describe("concatPath", () => {
  it("should return path", () => {
    expect(concatPath("/controllers/", "/path")).toEqual("/controllers/path");
    expect(concatPath("/controllers", "/path")).toEqual("/controllers/path");
    expect(concatPath("/controllers/", "path")).toEqual("/controllers/path");
    expect(concatPath(undefined, "/path")).toEqual("/path");
    expect(concatPath("/controllers/", undefined)).toEqual("/controllers");
    expect(concatPath("/", "/:id")).toEqual("/:id");
    expect(concatPath("/", "/")).toEqual("/");
    expect(concatPath("/", undefined)).toEqual("/");
    expect(concatPath(undefined, "/")).toEqual("/");
  });
  it("should concat regexp", () => {
    expect(concatPath(/\/(.*)/, /\/test(.*)/).source).toEqual("\\/(.*)\\/test(.*)");
    expect(concatPath(undefined, /\/test(.*)/).source).toEqual("\\/test(.*)");
    expect(concatPath(/\/(.*)/, undefined).source).toEqual("\\/(.*)");
    expect(concatPath(/\/(.*)/, "/test").source).toEqual("\\/(.*)\\/test");
    expect(concatPath("/test", /\/test(.*)/).source).toEqual("\\/test\\/test(.*)");
  });
});
