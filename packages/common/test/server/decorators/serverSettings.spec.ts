import {Metadata} from "@tsed/core";
import * as Sinon from "sinon";
import {SERVER_SETTINGS} from "../../../src/config/constants";
import {ServerSettings} from "../../../src/server";

class Test {
}

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
