import {Store} from "@tsed/core";
import {expect} from "chai";
import {ServerSettings} from "./serverSettings";

class Test {}

describe("ServerSettings", () => {
  it("should call Metadata.set() with the right parameters", () => {
    ServerSettings({debug: true})(Test);
    expect(Store.from(Test).get("configuration")).to.deep.eq({debug: true}, Test);
  });
});
