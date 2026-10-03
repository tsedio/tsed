import {FakeResponse} from "./FakeResponse.js";

describe("FakeResponse", () => {
  describe("cookie()", () => {
    it("should encode the value by default", () => {
      const response = new FakeResponse();

      response.cookie("name", "a b;c", {httpOnly: true});

      expect(response.headers["set-cookie"]).toEqual("name=a%20b%3Bc; Path=/; HttpOnly");
    });

    it("should use the custom encoder", () => {
      const response = new FakeResponse();

      response.cookie("name", "a b", {encode: (value: string) => value.replace(" ", "_")});

      expect(response.headers["set-cookie"]).toEqual("name=a_b; Path=/");
    });
  });
});
