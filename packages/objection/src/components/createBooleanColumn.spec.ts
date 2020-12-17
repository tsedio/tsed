import {Entity, IdColumn} from "@tsed/objection";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import Knex from "knex";
import Sinon from "sinon";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

const sandbox = Sinon.createSandbox();

describe("createBooleanColumn", () => {
  it("should create table from a given class", async () => {
    @Entity("users")
    class User {
      @Property()
      activated: boolean;
    }

    const table = createTableStub(sandbox);
    createColumns(table, User);

    expect(table.boolean).to.have.been.calledWithExactly("activated");
  });
});
