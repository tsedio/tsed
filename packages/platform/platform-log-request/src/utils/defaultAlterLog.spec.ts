import {defaultAlterLog} from "./defaultAlterLog.js";

describe("defaultAlterLog", () => {
  it("should return the expected log object", () => {
    expect(
      defaultAlterLog("info", {test: "test"}, {
        request: {
          method: "GET",
          url: "url",
          headers: {
            "x-forwarded-for": "value"
          },
          route: "route"
        }
      } as never)
    ).toEqual({
      method: "GET",
      route: "route",
      test: "test",
      url: "url"
    });
  });
  it("should return the expected log object (without route)", () => {
    expect(
      defaultAlterLog("info", {test: "test"}, {
        request: {
          method: "GET",
          url: "url",
          headers: {
            "x-forwarded-for": "value"
          }
        }
      } as never)
    ).toEqual({
      method: "GET",
      route: "url",
      test: "test",
      url: "url"
    });
  });
  it("should return the expected log object with extras info", () => {
    expect(
      defaultAlterLog("error", {test: "test"}, {
        request: {
          method: "GET",
          url: "url",
          headers: {
            "x-forwarded-for": "value"
          },
          route: "route"
        }
      } as never)
    ).toEqual({
      method: "GET",
      route: "route",
      test: "test",
      url: "url",
      body: undefined,
      headers: {
        "x-forwarded-for": "value"
      },
      params: undefined,
      query: undefined
    });
  });
});
