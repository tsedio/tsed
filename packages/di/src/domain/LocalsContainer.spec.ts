import {LocalsContainer} from "./LocalsContainer";

describe("LocalsContainer", () => {
  describe("destroy()", () => {
    it("should destroy container", async () => {
      // GIVEN
      const instance = {
        $onDestroy: jest.fn().mockResolvedValue(undefined)
      };
      const container = new LocalsContainer();
      container.set("TOKEN", instance);

      container.hooks.on("$onDestroy", () => instance.$onDestroy());

      await container.destroy();

      expect(instance.$onDestroy).toBeCalledWith();
    });
  });
});
