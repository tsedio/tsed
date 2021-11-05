import {expect} from "chai";
import Sinon from "sinon";
import {LocalsContainer} from "./LocalsContainer";

describe("LocalsContainer", () => {
  describe("destroy()", () => {
    it("should destroy container", async () => {
      // GIVEN
      const instance = {
        $onDestroy: Sinon.stub().resolves()
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      await container.destroy();

      expect(instance.$onDestroy).to.have.been.calledWithExactly();
      expect(container.size).to.eq(0);
    });
  });

  describe("alter()", () => {
    it("should alter value", () => {
      // GIVEN
      const instance = {
        $alterValue: Sinon.stub().returns("alteredValue")
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      const value = container.alter("$alterValue", "value");

      expect(instance.$alterValue).to.have.been.calledWithExactly("value");
      expect(value).to.eq("alteredValue");
    });
  });

  describe("alterAsync()", () => {
    it("should alter value", async () => {
      // GIVEN
      const instance = {
        $alterValue: Sinon.stub().returns("alteredValue")
      };
      const container = new LocalsContainer<any>();
      container.set("TOKEN", instance);

      const value = await container.alterAsync("$alterValue", "value");

      expect(instance.$alterValue).to.have.been.calledWithExactly("value");
      expect(value).to.eq("alteredValue");
    });
  });
});
