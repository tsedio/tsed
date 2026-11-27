import {FetchResponse} from "./FetchResponse.js";

describe("FetchResponse", () => {
  describe("setHeaders()", () => {
    it("should keep every Set-Cookie value", () => {
      const headers = new Headers();
      headers.append("set-cookie", "session=abc");
      headers.append("set-cookie", "theme=dark");

      const response = new FetchResponse().setHeaders(headers);

      expect(response.toResponse().headers.getSetCookie()).toEqual(["session=abc", "theme=dark"]);
    });

    it("should replace the existing values of each given header", () => {
      const response = new FetchResponse({headers: {"x-a": "old", "x-b": "kept"}}).appendHeader("set-cookie", "old=1");

      response.setHeaders([
        ["x-a", "new"],
        ["set-cookie", "new=1"]
      ]);

      const headers = response.toResponse().headers;

      expect(headers.get("x-a")).toBe("new");
      expect(headers.get("x-b")).toBe("kept");
      expect(headers.getSetCookie()).toEqual(["new=1"]);
    });
  });

  describe("toResponseInit()", () => {
    it("should return a snapshot of the headers", () => {
      const response = new FetchResponse().header("x-a", "1").status(201);
      const init = response.toResponseInit();

      response.header("x-a", "2").header("x-b", "3").status(500);

      expect(new Headers(init.headers).get("x-a")).toBe("1");
      expect(new Headers(init.headers).has("x-b")).toBe(false);
      expect(init.status).toBe(201);
    });
  });
});
