import {Entity} from "../decorators/entity.js";
import {Property} from "@tsed/schema";
import {createColumns} from "../utils/createColumns.js";
import {createTableStub} from "../../test/helpers/knex/table.js";

describe("createBooleanColumn", () => {
  it("should create table from a given class", () => {
    @Entity("users")
    class User {
      @Property()
      activated: boolean;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.boolean).toHaveBeenCalledWith("activated");
  });
});
