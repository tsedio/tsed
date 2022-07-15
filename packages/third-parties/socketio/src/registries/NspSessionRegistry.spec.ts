import {getNspSession} from "./NspSessionRegistry";

describe("NspSessionRegistry", () => {
  it("should return session", () => {
    expect(getNspSession()!).toBeInstanceOf(Map);
    expect(getNspSession("/")!).toBeInstanceOf(Map);
  });
});
