import {Property} from "@tsed/schema";

import {createTableStub} from "../../test/helpers/knex/table.js";
import {Entity} from "../decorators/entity.js";
import {createColumns} from "../utils/createColumns.js";

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
