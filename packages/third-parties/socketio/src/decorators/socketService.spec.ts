import {Store} from "@tsed/core";

import {SocketService} from "./socketService.js";

describe("SocketService", () => {
  describe("case 1", () => {
    class Test {}
    it("should set metadata", () => {
      SocketService("/namespace")(Test);
      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        namespace: "/namespace",
        type: "service"
      });
    });
  });
  describe("case 2", () => {
    class Test {}
    it("should set metadata", () => {
      SocketService()(Test);
      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        namespace: "/",
        type: "service"
      });
    });
  });
  describe("case 3", () => {
    class Test {}
    it("should set metadata", () => {
      const regexp = new RegExp(/test/);

      SocketService(regexp)(Test);
      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        namespace: regexp,
        type: "service"
      });
    });
  });
});
