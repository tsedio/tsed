import {Sinon} from "../../../tools";
import {ServerSettings} from "../../../../packages/common/src/server/decorators/serverSettings";
import {Metadata} from "../../../../packages/core/src/class/Metadata";
import {SERVER_SETTINGS} from "../../../../packages/common/src/config/constants/index";

class Test {}
describe("ServerSettings", () => {
  before(() => {
    this.metadataSetStub = Sinon.stub(Metadata, "set");
    ServerSettings({debug: true})(Test);
  });

  after(() => {
    this.metadataSetStub.restore();
  });

  it("should call Metadata.set() with the right parameters", () => {
    this.metadataSetStub.should.have.been.calledWithExactly(SERVER_SETTINGS, {debug: true}, Test);
  });
});
