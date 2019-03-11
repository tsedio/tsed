import {getNspSession} from "../../src/registries/NspSessionRegistry";

describe("NspSessionRegistry", () => {
  it("should return session", () => {
    getNspSession()!.should.be.instanceof(Map);
    getNspSession("/")!.should.be.instanceof(Map);
  });
});
