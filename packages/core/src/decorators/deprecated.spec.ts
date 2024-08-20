import {Deprecated} from "./deprecated.js";

describe("Deprecated", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockReturnValue();
    vi.spyOn(console, "warn").mockReturnValue();
  });
  it("should wrap method as deprecated", () => {
    class Test {
      @Deprecated("test")
      test() {}
    }

    new Test().test();

    expect(console.error).toHaveBeenCalledWith("test");
  });
  it("should wrap method as deprecated (throwDeprecation)", () => {
    class Test {
      @Deprecated("test")
      test() {}
    }

    (process as any).throwDeprecation = true;

    try {
      new Test().test();
    } catch (er) {
      expect(er.message).toEqual("test");
    } finally {
      (process as any).throwDeprecation = false;
    }
  });
  it("should wrap method as deprecated (traceDeprecation)", () => {
    class Test {
      @Deprecated("test")
      test() {}
    }

    (process as any).traceDeprecation = true;
    new Test().test();

    expect(console.error).toHaveBeenCalled();

    (process as any).traceDeprecation = false;
  });
});
