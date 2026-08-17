import {afterEach, beforeEach} from "vitest";
import {lazyInject, optionalLazyInject} from "./lazyInject.js";
import {DITest} from "../../node/index.js";

describe("lazyInject", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should lazy load module", async () => {
    const service = await lazyInject(() => import("./__mock__/lazy.import.module.js"));

    expect(service).toBeDefined();
    expect(service.called).toBeTruthy();

    await DITest.injector.emit("$onCustomEvent");

    expect(service.customCalled).toBeTruthy();
  });

  it("should optionally lazy load module", async () => {
    const service = await optionalLazyInject(() => import("./__mock__/lazy.import.module.js"));

    expect(service).toBeDefined();
  });
});
