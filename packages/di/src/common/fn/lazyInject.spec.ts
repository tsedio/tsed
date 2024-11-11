import {afterEach, beforeEach} from "vitest";

import {DITest} from "../../node/index.js";
import {lazyInject, optionalLazyInject} from "./lazyInject.js";

describe("lazyInject", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should lazy load module", async () => {
    const service = await lazyInject(() => import("./__mock__/lazy.import.module.js"));

    expect(service).toBeDefined();
  });

  it("should optionally lazy load module", async () => {
    const service = await optionalLazyInject(() => import("./__mock__/lazy.import.module.js"));

    expect(service).toBeDefined();
  });
});
