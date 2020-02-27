import * as Sinon from "sinon";
import {MongooseIndex} from "../../src/decorators/mongooseIndex";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@MongooseIndex()", () => {
  class Test {}

  it("should store options", () => {
    // GIVEN
    const fn = sandbox.stub();

    // WHEN
    @MongooseIndex({field: "1"}, {})
    class Test {}

    // THEN
    const options = schemaOptions(Test);

    options.should.deep.eq({
      indexes: [
        {
          fields: {
            field: "1"
          },
          options: {}
        }
      ]
    });
  });
});
