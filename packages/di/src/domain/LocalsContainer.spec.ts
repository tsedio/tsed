import {LocalsContainer} from "./LocalsContainer";

describe("LocalsContainer", () => {
  describe("destroy()", () => {
    it("should destroy container", async () => {
      // GIVEN
      const instance = {
        $onDestroy: jest.fn().mockResolvedValue(undefined)
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      await container.destroy();

      expect(instance.$onDestroy).toBeCalledWith();
      expect(container.size).toEqual(0);
    });
  });

  describe("alter()", () => {
    it("should alter value", () => {
      // GIVEN
      const instance = {
        $alterValue: jest.fn().mockReturnValue("alteredValue")
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      const value = container.alter("$alterValue", "value");

      expect(instance.$alterValue).toBeCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
  });

  describe("alterAsync()", () => {
    it("should alter value", async () => {
      // GIVEN
      const instance = {
        $alterValue: jest.fn().mockReturnValue("alteredValue")
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      const value = await container.alterAsync("$alterValue", "value");

      expect(instance.$alterValue).toBeCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
  });
});
