import {Hooks} from "./Hooks.js";

describe("Hooks", () => {
  describe("off()", () => {
    it("should remove a listener (using event, cb)", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      hooks.on("event", fn);
      hooks.on("event2", fn2);
      hooks.on("event2", fn3);

      expect(hooks.has("event")).toBe(true);
      expect(hooks.has("event2")).toBe(true);

      hooks.off("event", fn);
      hooks.off("event2", fn2);

      expect(hooks.has("event")).toBe(false);
      expect(hooks.has("event2")).toBe(true);

      hooks.off("event3", fn2);

      expect(hooks.has("event2")).toBe(true);

      hooks.emit("event", ["arg1"]);

      expect(fn).not.toHaveBeenCalled();
    });
    it("should remove a listener (using ref)", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();
      const ref = Symbol("ref");

      hooks.on("event", ref, fn);
      hooks.on("event2", ref, fn2);

      expect(hooks.has("event")).toBe(true);
      expect(hooks.has("event2")).toBe(true);

      hooks.off(ref);

      expect(hooks.has("event")).toBe(false);
      expect(hooks.has("event2")).toBe(false);

      hooks.emit("event", ["arg1"]);
      hooks.emit("event2", ["arg1"]);

      expect(fn).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
    });
  });
  describe("once()", () => {
    it("should call once a listener (using event, cb)", () => {
      const hooks = new Hooks();
      const fn = vi.fn();

      hooks.once("event", fn);

      expect(hooks.has("event")).toBe(true);

      hooks.emit("event", ["arg1"]);

      expect(hooks.has("event")).toBe(false);
      expect(fn).toHaveBeenCalled();
    });
    it("should call once a listener (using ref)", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();
      const ref = Symbol("ref");

      hooks.once("event", ref, fn);
      hooks.once("event2", ref, fn2);

      expect(hooks.has("event")).toBe(true);
      expect(hooks.has("event2")).toBe(true);

      hooks.emit("event", ["arg1"]);
      hooks.emit("event2", ["arg1"]);

      expect(hooks.has("event")).toBe(false);
      expect(hooks.has("event2")).toBe(false);
      expect(fn).toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
    });
  });
  describe("emit()", () => {
    it("should listen a hook and calls listener", () => {
      const hooks = new Hooks();
      const fn = vi.fn();

      hooks.on("event", fn);

      hooks.emit("event", ["arg1"]);

      expect(fn).toHaveBeenCalledWith("arg1");

      hooks.off("event", fn);
    });
    it("should calls listeners that match listeners with matching ref and without ref", () => {
      const hooks = new Hooks();
      const fn: any = vi.fn();
      fn.id = "f1";

      const fn2: any = vi.fn();
      fn.id = "f2";

      const fn3: any = vi.fn();
      fn3.id = "f3";
      const ref = Symbol("ref");

      hooks.on("event", ref, fn);
      hooks.on("event2", ref, fn2);
      hooks.on("event2", fn3);

      hooks.emit("event", ref, ["arg1"]);

      expect(fn).toHaveBeenCalledWith("arg1");
      expect(fn2).not.toHaveBeenCalledWith("arg1");
      expect(fn3).not.toHaveBeenCalledWith("arg1");

      hooks.emit("event2", ref, ["arg1"]);

      expect(fn2).toHaveBeenCalledWith("arg1");
      expect(fn3).toHaveBeenCalledWith("arg1");

      hooks.off(ref);
    });
    it("should not call listeners if the ref mismatch", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const ref = Symbol("ref");
      const ref2 = Symbol("ref");

      hooks.on("event", ref, fn);
      hooks.on("event2", ref, fn2);
      hooks.on("event2", ref, fn3);

      hooks.emit("event", ref2, ["arg1"]);

      expect(fn).not.toHaveBeenCalledWith("arg1");
      expect(fn2).not.toHaveBeenCalledWith("arg1");
      expect(fn3).not.toHaveBeenCalledWith("arg1");

      hooks.off(ref);
    });
    it("should call", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();
      const ref = Symbol("ref");
      const ref2 = Symbol("ref");

      hooks.on("event", ref, fn);
      hooks.on("event2", ref, fn2);
      hooks.on("event2", ref, fn3);

      hooks.emit("event", ref2, ["arg1"]);

      expect(fn).not.toHaveBeenCalledWith("arg1");
      expect(fn2).not.toHaveBeenCalledWith("arg1");
      expect(fn3).not.toHaveBeenCalledWith("arg1");

      hooks.off(ref);
    });
  });
  describe("asyncEmit()", () => {
    it("should async listen a hook and calls listener", async () => {
      const hooks = new Hooks();
      const fn = vi.fn();

      hooks.on("event", fn);

      await hooks.asyncEmit("event", ["arg1"]);

      expect(fn).toHaveBeenCalledWith("arg1");

      hooks.off("event", fn);
    });
  });
  describe("alter()", () => {
    it("should listen a hook and calls listener", () => {
      const hooks = new Hooks();
      const fn = vi.fn().mockReturnValue("valueAltered");

      hooks.on("event", fn);

      const value = hooks.alter("event", "value");

      expect(fn).toHaveBeenCalledWith("value");
      expect(value).toBe("valueAltered");

      hooks.off("event", fn);
    });
  });
  describe("alterAsync()", () => {
    it("should async listen a hook and calls listener", async () => {
      const hooks = new Hooks();
      const fn = vi.fn().mockReturnValue("valueAltered");

      hooks.on("event", fn);

      await hooks.asyncAlter("event", "value", ["arg1"]);

      expect(fn).toHaveBeenCalledWith("value", "arg1");

      hooks.off("event", fn);

      hooks.destroy();
    });
  });
});
