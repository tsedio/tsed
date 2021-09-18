import {Entity, IdColumn} from "@tsed/objection";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

describe("createIdColumn", () => {
  it("should create table from a given class (bigIncrements)", async () => {
    @Entity("users")
    class User {
      @IdColumn("bigIncrements")
      id: number;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.bigIncrements).toHaveBeenCalledWith("id");
  });

  it("should create table from a given class (increments)", async () => {
    @Entity("users")
    class User {
      @IdColumn("increments")
      id: number;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.increments).toHaveBeenCalledWith("id");
  });
});
