import {toPrefix} from "./toPrefix.js";

describe("toPrefix", () => {
  it('should return "/" for root endpoint', () => {
    expect(toPrefix("/")).toBe("/");
  });
  it('should append "/" to endpoint not ending with "/"', () => {
    expect(toPrefix("/api")).toBe("/api/");
  });
  it('should return the same endpoint if it already ends with "/"', () => {
    expect(toPrefix("/api/")).toBe("/api/");
  });
});
