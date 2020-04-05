import {createPlatformApplication, PlatformApplication} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {expect} from "chai";

describe("createPlatformApplication", () => {
  it("should fork the platformApplication", () => {
    const injector = new InjectorService();

    createPlatformApplication(injector);

    expect(injector.get(PlatformApplication)).to.be.instanceof(PlatformApplication);
  });
});
