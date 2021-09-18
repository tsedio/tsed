import {Entity} from "@tsed/objection";
import {Property} from "@tsed/schema";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

describe("createBooleanColumn", () => {
  it("should create table from a given class", async () => {
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
