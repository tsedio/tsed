import {Store} from "@tsed/core";
import {Controller} from "@tsed/di";

import {Vite} from "./vite.js";

@Controller("/")
class ControllerTest {
  @Vite()
  post() {
    return;
  }

  @Vite("nice-view")
  postWithView() {
    return;
  }
}

describe("ViteDecorator", () => {
  it("should return attached View with *.vite with empty path", () => {
    const metadata = Store.fromMethod(ControllerTest, "post").get("view");

    expect(metadata.path).toEqual("*.vite");
  });

  it("should return attached View with {path}.vite", () => {
    const metadata = Store.fromMethod(ControllerTest, "postWithView").get("view");

    expect(metadata.path).toEqual("nice-view.vite");
  });
});
