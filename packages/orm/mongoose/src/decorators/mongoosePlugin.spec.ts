import {expect} from "chai";
import Sinon from "sinon";
import {MongoosePlugin} from "../../src/decorators/mongoosePlugin";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@MongoosePlugin()", () => {
  it("should store options", () => {
    // GIVEN
    const fn = sandbox.stub();

    // WHEN
    @MongoosePlugin(fn, {})
    class Test {}

    // THEN
    const options = schemaOptions(Test);

    expect(options).to.deep.eq({
      plugins: [
        {
          plugin: fn,
          options: {}
        }
      ]
    });
  });
});
