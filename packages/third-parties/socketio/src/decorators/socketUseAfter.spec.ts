import {Store} from "@tsed/core";

import {SocketUseAfter} from "../index.js";

describe("@SocketUseAfter", () => {
  describe("when the decorator is used on a class", () => {
    beforeAll(() => {});

    it("should store metadata", () => {
      class Test {}

      const middleware: any = () => {};
      SocketUseAfter(middleware)(Test);

      expect(Store.from(Test).get("socketIO")).toEqual({
        useAfter: [middleware]
      });
    });
  });

  describe("when the decorator is used on a method", () => {
    it("should store metadata", () => {
      class Test {}

      const middleware: any = () => {};

      SocketUseAfter(middleware)(Test, "test", {});

      expect(Store.from(Test).get("socketIO")).toEqual({
        handlers: {
          test: {
            useAfter: [middleware]
          }
        }
      });
    });
  });
});
