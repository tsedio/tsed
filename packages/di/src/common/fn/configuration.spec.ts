import {Store} from "@tsed/core";
import {beforeEach} from "vitest";

import {DITest} from "../../node/index.js";
import {Configuration} from "../decorators/configuration.js";
import {Injectable} from "../decorators/injectable.js";
import {Provider} from "../domain/Provider.js";
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

  it("should declare a new provider with custom configuration", () => {
    @Configuration({})
    class Test {}

    const provider = new Provider(Test);
    provider.injectable = false;
    provider.configuration = {};

    expect(Store.from(Test).get("configuration")).toEqual({});
  });
});
