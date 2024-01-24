import {Controller} from "@tsed/common";
import {Store} from "@tsed/core";

import {Vike} from "./vike";

@Controller("/")
class ControllerTest {
  @Vike()
  post() {
    return;
  }

  @Vike("nice-view")
  postWithView() {
    return;
  }
}

describe("VikeDecorator", () => {
  it("should return attached View with *.vike with empty path", () => {
    const metadata = Store.fromMethod(ControllerTest, "post").get("view");

    expect(metadata.path).toEqual("*.vike");
  });

  it("should return attached View with {path}.vike", () => {
    const metadata = Store.fromMethod(ControllerTest, "postWithView").get("view");

    expect(metadata.path).toEqual("nice-view.vike");
  });
});
