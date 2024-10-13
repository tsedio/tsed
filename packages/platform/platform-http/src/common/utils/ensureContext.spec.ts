import {runInContext} from "@tsed/di";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {ensureContext} from "./ensureContext.js";

describe("ensureContext()", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return context (no async_hook)", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const stub = vi.fn();
    const req = {
      $ctx
    };

    await ensureContext(req, stub);

    expect(stub).toHaveBeenCalledWith($ctx);
  });

  it("should return context (with async_hook)", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const stub = vi.fn();
    const req = {};

    await runInContext($ctx, () => ensureContext(req, stub));

    expect(stub).toHaveBeenCalledWith($ctx);
  });

  it("should return context (no async_hook, no context)", async () => {
    const stub = vi.fn();
    const fallback = vi.fn();
    const req = {};

    await ensureContext(req, stub, fallback);

    expect(fallback).toHaveBeenCalledWith();
  });
});
