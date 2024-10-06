import {catchError} from "@tsed/core";
import {MaxLength, Property} from "@tsed/schema";

import {createTableStub} from "../../test/helpers/knex/table.js";
import {Decimal} from "../decorators/decimal.js";
import {Entity} from "../decorators/entity.js";
import {IdColumn} from "../decorators/idColumn.js";
import {createColumns} from "./createColumns.js";

describe("createTable", () => {
  it("should create table from a given class (columns doesn't exists)", () => {
    @Entity("users")
    class User {
      @IdColumn()
      id: number;

      @Property()
      @MaxLength(200)
      name: string;

      @Property()
      age: number;

      @Decimal({scale: 1, precision: 12})
      score: number;

      @Property()
      active: boolean;
    }

    const table = createTableStub();

    createColumns(table, User);

    expect(table.increments).toHaveBeenCalledWith("id");
    expect(table.primary).toHaveBeenCalledWith();
    expect(table.string).toHaveBeenCalledWith("name", 200);
    expect(table.decimal).toHaveBeenCalledWith("age", undefined, undefined);
    expect(table.decimal).toHaveBeenCalledWith("score", 12, 1);
    expect(table.boolean).toHaveBeenCalledWith("active");
  });
  it("should create table from a given class (columns exists)", () => {
    @Entity("users")
    class User {
      @IdColumn()
      id: number;

      @Property()
      @MaxLength(200)
      name: string;

      @Property()
      age: number;

      @Decimal({scale: 1, precision: 12})
      score: number;

      @Property()
      active: boolean;
    }

    const table = createTableStub();

    createColumns(table, User);
  });

  it("should throw error when type isn't supported", () => {
    @Entity("users")
    class User {
      @Property()
      date: any;
    }

    const table = createTableStub();
    const error = catchError(() => createColumns(table, User));

    expect(error).toBe("Column type object isn't supported. Add function to ColumnTypesContainer to map the column with Knex");
  });
});
