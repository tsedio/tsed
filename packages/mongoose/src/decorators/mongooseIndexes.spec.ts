import {expect} from "chai";
import Sinon from "sinon";
import {MongooseIndexes} from "./mongooseIndexes";
import {schemaOptions} from "../utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@MongooseIndexes()", () => {
  class Test {}

  it("should store options", () => {
    // GIVEN
    const fn = sandbox.stub();

    // WHEN
    @MongooseIndexes([
      {fields: {field: "1"}, options: {}},
      {fields: {field2: "1"}, options: {}}
    ])
    class Test {}

    // THEN
    const options = schemaOptions(Test);

    expect(options).to.deep.eq({
      indexes: [
        {
          fields: {
            field: "1"
          },
          options: {}
        },
        {
          fields: {
            field2: "1"
          },
          options: {}
        }
      ]
    });
  });
});
