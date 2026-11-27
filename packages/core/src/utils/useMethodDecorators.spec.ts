import {useMethodDecorator, useMethodDecorators} from "./useMethodDecorators.js";

describe("useMethodDecorators()", () => {
  class Test {
    method() {}
  }

  it("should skip falsy decorators and give the descriptor to the others, in order, on each application", () => {
    const calls: any[] = [];
    const first = vi.fn((...args: any[]) => calls.push(["first", ...args]));
    const second = vi.fn((...args: any[]) => calls.push(["second", ...args]));
    const decorator = useMethodDecorators(first, undefined as any, null as any, second);
    const descriptor = Object.getOwnPropertyDescriptor(Test.prototype, "method");

    decorator(Test.prototype, "method");
    decorator(Test.prototype, "method");

    expect(calls).toEqual([
      ["first", Test.prototype, "method", descriptor],
      ["second", Test.prototype, "method", descriptor],
      ["first", Test.prototype, "method", descriptor],
      ["second", Test.prototype, "method", descriptor]
    ]);
  });

  it("should give the descriptor to a single decorator", () => {
    const decorator = vi.fn();

    useMethodDecorator(decorator)(Test.prototype, "method");

    expect(decorator).toHaveBeenCalledWith(Test.prototype, "method", Object.getOwnPropertyDescriptor(Test.prototype, "method"));
  });
});
