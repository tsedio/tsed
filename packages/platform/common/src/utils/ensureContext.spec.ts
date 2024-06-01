import {PlatformTest} from "../services/PlatformTest.js";
import {ensureContext} from "./ensureContext.js";

describe("ensureContext()", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return context (no async_hook)", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const stub = jest.fn();
    const req = {
      $ctx
    };

    await ensureContext(req, stub);

    expect(stub).toHaveBeenCalledWith($ctx);
  });

  it("should return context (with async_hook)", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const stub = jest.fn();
    const req = {};

    await $ctx.runInContext(() => ensureContext(req, stub));

    expect(stub).toHaveBeenCalledWith($ctx);
  });

  it("should return context (no async_hook, no context)", async () => {
    const stub = jest.fn();
    const fallback = jest.fn();
    const req = {};

    await ensureContext(req, stub, fallback);

    expect(fallback).toHaveBeenCalledWith();
  });
});
