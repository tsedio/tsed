import {Property} from "@tsed/schema";

import {createTableStub} from "../../test/helpers/knex/table.js";
import {Decimal} from "../decorators/decimal.js";
import {Entity} from "../decorators/entity.js";
import {createColumns} from "../utils/createColumns.js";

describe("createNumberColumn", () => {
  it("should create table from a given class (default)", async () => {
    @Entity("users")
    class User {
      @Property()
      prop: number;
    }

    const table = createTableStub();
    await createColumns(table, User);

    expect(table.decimal).toHaveBeenCalledWith("prop", undefined, undefined);
  });

  it("should create table from a given class (decimal)", async () => {
    @Entity("users")
    class User {
      @Decimal({scale: 1, precision: 12})
      prop: number;
    }

    const table = createTableStub();
    await createColumns(table, User);

    expect(table.decimal).toHaveBeenCalledWith("prop", 12, 1);
  });
});
