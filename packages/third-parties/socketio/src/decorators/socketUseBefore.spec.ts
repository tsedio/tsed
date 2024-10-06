import {Store} from "@tsed/core";

import {SocketUseBefore} from "../index.js";

describe("@SocketUseBefore", () => {
  describe("when the decorator is used on a class", () => {
    it("should store metadata", () => {
      class Test {}
      const middleware: any = () => {};
      SocketUseBefore(middleware)(Test);

      expect(Store.from(Test).get("socketIO")).toEqual({
        useBefore: [middleware]
      });
    });
  });

  describe("when the decorator is used on a method", () => {
    it("should store metadata", () => {
      class Test {}
      const middleware: any = () => {};

      SocketUseBefore(middleware)(Test, "test", {});

      expect(Store.from(Test).get("socketIO")).toEqual({
        handlers: {
          test: {
            useBefore: [middleware]
          }
        }
      });
    });
  });
});
