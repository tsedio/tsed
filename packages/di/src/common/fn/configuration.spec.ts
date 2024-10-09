import {beforeEach} from "vitest";

import {DITest} from "../../node/index.js";
import {Injectable} from "../decorators/injectable.js";
import {configuration} from "./configuration.js";
import {inject} from "./inject.js";
import {injector} from "./injector.js";

@Injectable()
class Test {
  public config = configuration();
}

describe("configuration()", () => {
  beforeEach(() =>
    DITest.create({
      feature: "feature"
    })
  );
  afterEach(() => DITest.reset());

  it("should inject configuration", async () => {
    const instance = inject(Test);

    expect(instance.config).toEqual(injector().settings);
    expect(instance.config.get("feature")).toEqual("feature");
  });
});
