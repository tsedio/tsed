import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {AuthenticatedMiddleware} from "../../../../src/mvc";

const middleware: any = Sinon.stub();
const useBeforeStub: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../src/mvc/decorators/method/authenticated", {
  "./useBefore": {UseBefore: useBeforeStub}
});


describe("Authenticated", () => {
  describe("when the decorator is used on a method", () => {
    it("should set metadata", () => {
      // GIVEN

      // WHEN
      class Test {
        @Authenticated({options: "options"})
        test() {
        }
      }

      const store = Store.fromMethod(Test, "test");

      // THEN
      expect(store.get(AuthenticatedMiddleware)).to.deep.eq({options: "options"});
      expect(store.get("responses")).to.deep.eq({"403": {description: "Forbidden"}});
      useBeforeStub.should.be.calledWithExactly(AuthenticatedMiddleware);
      middleware.should.be.calledWithExactly(Test.prototype, "test", descriptorOf(Test, "test"));
      store.clear();
    });
  });

  describe("when the decorator is used on a controller", () => {
    it("should set metadata", () => {
      // GIVEN

      // WHEN
      @Authenticated({options: "options"})
      class Test {
        test() {
        }
      }

      const store = Store.fromMethod(Test, "test");

      // THEN
      expect(store.get(AuthenticatedMiddleware)).to.deep.eq({options: "options"});
      expect(store.get("responses")).to.deep.eq({"403": {description: "Forbidden"}});
      useBeforeStub.should.be.calledWithExactly(AuthenticatedMiddleware);
      middleware.should.be.calledWithExactly(Test.prototype, "test", descriptorOf(Test, "test"));
      store.clear();
    });
  });

  describe("when the decorator is used on a controller with class inheritance", () => {
    it("should set metadata", () => {
      // GIVEN
      class Base {
        value = "1";

        test2(option: string) {
          return "test2" + option + this.value;
        }
      }

      // WHEN
      @Authenticated({options: "options"})
      class Test extends Base {
        test() {
        }
      }

      const store1 = Store.fromMethod(Test, "test");
      const store2 = Store.fromMethod(Test, "test2");

      // THEN
      expect(store1.get(AuthenticatedMiddleware)).to.deep.eq({options: "options"});
      expect(store1.get("responses")).to.deep.eq({"403": {description: "Forbidden"}});

      expect(store2.get(AuthenticatedMiddleware)).to.deep.eq({options: "options"});
      expect(store2.get("responses")).to.deep.eq({"403": {description: "Forbidden"}});

      expect(new Test().test2("test")).to.eq("test2test1");

      useBeforeStub.should.be.calledWithExactly(AuthenticatedMiddleware);
      middleware.should.be.calledWithExactly(Test.prototype, "test", descriptorOf(Test, "test"));
      store1.clear();
      store2.clear();
    });
  });
});
