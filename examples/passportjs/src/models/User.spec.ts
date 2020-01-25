import {expect} from "chai";
import {User} from "./User";

describe("User", () => {
  describe(".verifyPassword()", () => {
    it("should validate password", () => {
      const user = new User();
      user.password = "pass";
      expect(user.verifyPassword("pass")).to.eq(true);
    });
    it("shouldn't validate password", () => {
      const user = new User();
      user.password = "pass";
      expect(user.verifyPassword("pas2s")).to.eq(false);
    });
  });
});
