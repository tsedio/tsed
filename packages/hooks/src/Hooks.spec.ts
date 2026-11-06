import {Hooks} from "./Hooks.js";

describe("Hooks", () => {
  describe("instance without listener", () => {
    it("should accept every call before the first listener is registered", async () => {
      const hooks = new Hooks();

      expect(hooks.has("event")).toBe(false);
      expect(hooks.off("event", vi.fn())).toBe(hooks);
      expect(hooks.off(Symbol("ref"))).toBe(hooks);
      expect(hooks.emit("event", ["a"])).toBeUndefined();
      expect(await hooks.asyncEmit("event", ["a"])).toBeUndefined();
      expect(hooks.alter("event", "value", ["a"])).toBe("value");
      expect(await hooks.asyncAlter("event", "value", ["a"])).toBe("value");

      hooks.destroy();

      expect(hooks.has("event")).toBe(false);
    });
    it("should register listeners again after destroy()", () => {
      const hooks = new Hooks();
      const fn = vi.fn();

      hooks.on("event", vi.fn());
      hooks.destroy();
      hooks.on("event", fn).on("event", fn);
      hooks.emit("event", ["a"]);

      expect(hooks.has("event")).toBe(true);
      expect(fn).toHaveBeenCalledTimes(2);
    });
    it("should keep the listeners of each event apart", () => {
      const hooks = new Hooks();
      const fn = vi.fn();
      const fn2 = vi.fn();

      hooks.on("event", fn);
      hooks.on("event2", fn2);
      hooks.off("event", fn);
      hooks.on("event", fn2);
      hooks.emit("event", ["a"]);

      expect(fn).not.toHaveBeenCalled();
      expect(fn2).toHaveBeenCalledTimes(1);
    });
  });
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
  describe("emit() arguments", () => {
    it("should call the listeners without arguments when no args are given", () => {
      const hooks = new Hooks();
      const lengths: number[] = [];

      hooks.on("event", (...all: unknown[]) => lengths.push(all.length));

      hooks.emit("event");
      hooks.emit("event", Symbol("ref"));
      hooks.emit("event", []);

      expect(lengths).toEqual([0, 0, 0]);
    });
  });
  describe("asyncEmit() listeners", () => {
    it("should call sync listeners and wait for async listeners and thenables", async () => {
      const hooks = new Hooks();
      const calls: string[] = [];

      hooks.on("event", (arg: string) => {
        calls.push("sync " + arg);
        return "value";
      });
      hooks.on("event", async (arg: string) => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        calls.push("async " + arg);
      });
      hooks.on("event", (arg: string) => ({
        then(resolve: () => void) {
          setTimeout(() => {
            calls.push("thenable " + arg);
            resolve();
          }, 5);
        }
      }));

      const result = await hooks.asyncEmit("event", ["a"]);

      expect(result).toBeUndefined();
      expect(calls.sort()).toEqual(["async a", "sync a", "thenable a"]);
    });
    it("should reject when an async listener rejects", async () => {
      const hooks = new Hooks();

      hooks.on("event", () => undefined);
      hooks.on("event", () => Promise.reject(new Error("async error")));

      await expect(hooks.asyncEmit("event", ["a"])).rejects.toThrow("async error");
    });
    it("should return a rejected promise when a sync listener throws, without calling the next listeners", async () => {
      const hooks = new Hooks();
      const next = vi.fn();

      hooks.on("event", () => {
        throw new Error("sync error");
      });
      hooks.on("event", next);

      const promise = hooks.asyncEmit("event", ["a"]);

      expect(promise).toBeInstanceOf(Promise);
      await expect(promise).rejects.toThrow("sync error");
      expect(next).not.toHaveBeenCalled();
    });
    it("should not call a listener added by another listener during the same call", async () => {
      const hooks = new Hooks();
      const added = vi.fn();

      hooks.on("event", () => {
        hooks.on("event", added);
      });

      await hooks.asyncEmit("event", ["a"]);

      expect(added).not.toHaveBeenCalled();

      await hooks.asyncEmit("event", ["b"]);

      expect(added).toHaveBeenCalledWith("b");
    });
    it("should call the listeners matching the ref and the listeners without ref", async () => {
      const hooks = new Hooks();
      const ref = Symbol("ref");
      const withRef = vi.fn();
      const withOtherRef = vi.fn();
      const withoutRef = vi.fn();

      hooks.on("event", ref, withRef);
      hooks.on("event", Symbol("other"), withOtherRef);
      hooks.on("event", withoutRef);

      await hooks.asyncEmit("event", ref, ["a"]);

      expect(withRef).toHaveBeenCalledWith("a");
      expect(withOtherRef).not.toHaveBeenCalled();
      expect(withoutRef).toHaveBeenCalledWith("a");
    });
    it("should call a once listener a single time", async () => {
      const hooks = new Hooks();
      const fn = vi.fn();

      hooks.once("event", fn);

      await hooks.asyncEmit("event", ["a"]);
      await hooks.asyncEmit("event", ["b"]);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(hooks.has("event")).toBe(false);
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
  describe("alter() arguments", () => {
    it.each([[[]], [["a"]], [["a", "b"]], [["a", "b", "c"]]])("should pass the value then %j to every listener", (args) => {
      const hooks = new Hooks();
      const received: unknown[][] = [];

      hooks.on("event", function (...all: unknown[]) {
        received.push(all);
        return `${all[0]}+`;
      });
      hooks.on("event", function (...all: unknown[]) {
        received.push(all);
        return `${all[0]}+`;
      });

      expect(hooks.alter("event", "v", args)).toBe("v++");
      expect(received).toEqual([
        ["v", ...args],
        ["v+", ...args]
      ]);
    });
    it("should call the listeners with the given this", () => {
      const hooks = new Hooks();
      const self = {};
      let receivedThis: unknown;

      hooks.on("event", function (this: unknown, value: unknown) {
        receivedThis = this;
        return value;
      });

      hooks.alter("event", "v", ["a"], self);

      expect(receivedThis).toBe(self);
    });
    it("should call a listener added by a previous listener of the same event", () => {
      const hooks = new Hooks();

      hooks.on("event", (value: string) => {
        hooks.on("event", (value: string) => value + "2");
        return value + "1";
      });

      expect(hooks.alter("event", "v", ["a"])).toBe("v12");
    });
    it("should not share the default args between calls", () => {
      const hooks = new Hooks();

      hooks.on("event", (...all: unknown[]) => all.length);

      expect(hooks.alter("event", "v")).toBe(1);
      expect(hooks.alter("event", "v")).toBe(1);
    });
  });
  describe("asyncAlter() arguments", () => {
    it.each([[[]], [["a"]], [["a", "b", "c"]]])("should pass the value then %j to every listener", async (args) => {
      const hooks = new Hooks();
      const received: unknown[][] = [];

      hooks.on("event", async (...all: unknown[]) => {
        received.push(all);
        return `${all[0]}+`;
      });
      hooks.on("event", (...all: unknown[]) => {
        received.push(all);
        return `${all[0]}+`;
      });

      expect(await hooks.asyncAlter("event", "v", args, {})).toBe("v++");
      expect(received).toEqual([
        ["v", ...args],
        ["v+", ...args]
      ]);
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
