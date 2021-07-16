import {ControllerProvider} from "@tsed/common";
import {expect} from "chai";
import {getControllerPath} from "./getControllerPath";

function getControllerProviderFixture() {
  class Test {}
  const controllerProvider = new ControllerProvider(Test);
  controllerProvider.path = "/";

  return controllerProvider;
}
describe("getControllerPath", () => {
  it("should get endpoint Url without parameters", () => {
    const provider = getControllerProviderFixture();

    expect(getControllerPath("", provider)).to.eq("/");
  });

  it("should get endpoint Url with parameters", () => {
    const provider = getControllerProviderFixture();

    expect(getControllerPath("/", provider)).to.eq("/");
  });

  it("should get endpoint Url with parameters", () => {
    const provider = getControllerProviderFixture();

    expect(getControllerPath("/rest/", provider)).to.eq("/rest/");
  });
});
