import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {OidcJwks} from "./OidcJwks";

const sandbox = Sinon.createSandbox();
describe("OidcJwks", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should create files", async () => {
    const oidcJwks = await PlatformTest.invoke<OidcJwks>(OidcJwks);

    sandbox.stub(oidcJwks.fs, "ensureDirSync");
    sandbox.stub(oidcJwks.fs, "existsSync").returns(false);
    sandbox.stub(oidcJwks.fs, "readFileSync").returns("{}");
    sandbox.stub(oidcJwks.fs, "writeFileSync");

    await oidcJwks.getJwks();

    expect(oidcJwks.fs.writeFileSync).to.have.been.called;
    sandbox.restore();
  });
});
