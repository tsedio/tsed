import {Perf} from "@tsed/perf";
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

      const value = await container.alter("$alterValue", "value");

      expect(instance.$alterValue).to.have.been.calledWithExactly("value");
      expect(value).to.eq("alteredValue");
    });
  });

  describe("iterator", () => {
    it("should return iterable", () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10; i++) {
        container.set("Token" + i, new TestProvider());
      }

      for (const [, provider] of container) {
        expect(provider).to.be.instanceOf(TestProvider);
      }
    });
  });

  describe("performance", () => {
    it("should call handlers", async () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10000; i++) {
        container.set("Token" + i, new TestProvider());
      }

      const perf = new Perf();

      const {time} = await perf.run<Promise<void>>(() => container.emit("$onInit"));

      expect(time).to.be.below(2.5);
    });

    it("should be used with for of (symbol.iterator)", async () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10000; i++) {
        container.set("Token" + i, new TestProvider());
      }

      const perf = new Perf();
      let called = false;
      const {time} = await perf.run(() => {
        for (let p of container) {
          called = true;
        }
        return null;
      });

      expect(called).to.eq(true);
      expect(time).to.be.below(2.5);
    });
    it("should be used with .values()", async () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10000; i++) {
        container.set("Token" + i, new TestProvider());
      }

      const perf = new Perf();
      let called = false;

      const {time} = await perf.run(() => {
        for (let p of container.values()) {
          called = true;
          expect(p).to.be.instanceof(TestProvider);
        }
        return null;
      });

      expect(called).to.eq(true);
      expect(time).to.be.below(2.5);
    });
    it("should be used with .keys()", async () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10000; i++) {
        container.set("Token" + i, new TestProvider());
      }

      const perf = new Perf();
      let called = false;
      const {time} = await perf.run(() => {
        for (let p of container.keys()) {
          called = true;
          expect(p).to.be.a("string");
        }
        return null;
      });

      expect(called).to.eq(true);
      expect(time).to.be.below(2.5);
    });
    it("should be used with .entries()", async () => {
      const container = new LocalsContainer<any>();

      class TestProvider {
        $onInit() {}
      }

      for (let i = 0; i < 10000; i++) {
        container.set("Token" + i, new TestProvider());
      }

      const perf = new Perf();
      let called = false;

      const {time} = await perf.run(() => {
        for (let p of container.entries()) {
          called = true;
          expect(p[0]).to.be.a("string");
          expect(p[1]).to.be.instanceof(TestProvider);
        }
        return null;
      });

      console.log(time);
      expect(called).to.eq(true);
      expect(time).to.be.below(2.5);
    });
  });
});
