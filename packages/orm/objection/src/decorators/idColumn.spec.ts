import {Store} from "@tsed/core";
import {IdColumn} from "@tsed/objection";
import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Model} from "objection";

describe("@IdColumn", () => {
  it("should set metadata", () => {
    class MyModel extends Model {
      @IdColumn()
      id: number;
    }

    expect(getJsonSchema(MyModel)).to.deep.eq({
      properties: {
        id: {
          type: "number"
        }
      },
      type: "object"
    });
    expect(Store.from(MyModel, "id").get("objection")).to.deep.eq({
      columnType: "idColumn",
      options: {
        type: "increments"
      }
    });

    expect(MyModel.idColumn).to.deep.eq("id");
  });
});
