import {Entity} from "../decorators/entity";
import {IdColumn} from "../decorators/idColumn";
import {createColumns} from "../utils/createColumns";
import {createTableStub} from "../../test/helpers/knex/table";

describe("createIdColumn", () => {
  it("should create table from a given class (bigIncrements)", () => {
    @Entity("users")
    class User {
      @IdColumn("bigIncrements")
      id: number;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.bigIncrements).toHaveBeenCalledWith("id");
  });

  it("should create table from a given class (increments)", () => {
    @Entity("users")
    class User {
      @IdColumn("increments")
      id: number;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.increments).toHaveBeenCalledWith("id");
  });

  it("should create table from a given class (uuid)", () => {
    @Entity("users")
    class User {
      @IdColumn("uuid")
      id: string;
    }

    const table = createTableStub();
    createColumns(table, User);

    expect(table.uuid).toHaveBeenCalledWith("id");
  });
});
