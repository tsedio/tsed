import {Hooks} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";

const sandbox = Sinon.createSandbox();
describe("Hooks", () => {
  describe("emit", () => {
    it("should listen a hook and calls listener", () => {
      const hooks = new Hooks();
      const fn = sandbox.stub();

      hooks.on("event", fn);

      hooks.emit("event", ["arg1"]);

      fn.should.have.been.calledWithExactly("arg1");

      hooks.off("event", fn);
    });
    it("should async listen a hook and calls listener", async () => {
      const hooks = new Hooks();
      const fn = sandbox.stub();

      hooks.on("event", fn);

      await hooks.asyncEmit("event", ["arg1"]);

      fn.should.have.been.calledWithExactly("arg1");

      hooks.off("event", fn);
    });
  });
  describe("alter", () => {
    it("should listen a hook and calls listener", () => {
      const hooks = new Hooks();
      const fn = sandbox.stub().returns("valueAltered");

      hooks.on("event", fn);

      const value = hooks.alter("event", "value");

      fn.should.have.been.calledWithExactly("value");
      expect(value).to.eq("valueAltered");

      hooks.off("event", fn);
    });
    it("should async listen a hook and calls listener", async () => {
      const hooks = new Hooks();
      const fn = sandbox.stub().returns("valueAltered");

      hooks.on("event", fn);

      await hooks.asyncAlter("event", "value", ["arg1"]);

      fn.should.have.been.calledWithExactly("value", "arg1");

      hooks.off("event", fn);
    });
  });
});
