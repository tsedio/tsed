import {expect} from "chai";
import {getNspSession} from "./NspSessionRegistry";

describe("NspSessionRegistry", () => {
  it("should return session", () => {
    expect(getNspSession()!).to.be.instanceof(Map);
    expect(getNspSession("/")!).to.be.instanceof(Map);
  });
});
