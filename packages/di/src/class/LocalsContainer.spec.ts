import * as Sinon from "sinon";
import {LocalsContainer} from "../../src/class/LocalsContainer";

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

      instance.$onDestroy.should.have.been.calledWithExactly();
      container.size.should.eq(0);
    });
  });
});
