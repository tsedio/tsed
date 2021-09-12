import {Decimal, Entity} from "@tsed/objection";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import Knex from "knex";
import Sinon from "sinon";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

const sandbox = Sinon.createSandbox();

describe("createNumberColumn", () => {
  it("should create table from a given class (default)", async () => {
    @Entity("users")
    class User {
      @Property()
      prop: number;
    }

    const table = createTableStub(sandbox);
    await createColumns(table, User);

    expect(table.decimal).to.have.been.calledWithExactly("prop", undefined, undefined);
  });

  it("should create table from a given class (decimal)", async () => {
    @Entity("users")
    class User {
      @Decimal({scale: 1, precision: 12})
      prop: number;
    }

    const table = createTableStub(sandbox);
    await createColumns(table, User);

    expect(table.decimal).to.have.been.calledWithExactly("prop", 12, 1);
  });
});
