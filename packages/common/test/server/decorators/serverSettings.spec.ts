import {Store} from "@tsed/core";
import {ServerSettings} from "../../../src/server";

class Test {
}

describe("ServerSettings", () => {
  it("should call Metadata.set() with the right parameters", () => {
    ServerSettings({debug: true})(Test);
    Store.from(Test).get("configuration").should.deep.eq({debug: true}, Test);
  });
});
