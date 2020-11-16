import {Decimal, Entity} from "@tsed/objection";
import {MaxLength, Property} from "@tsed/schema";
import {expect} from "chai";
import * as Knex from "knex";
import * as Sinon from "sinon";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

const sandbox = Sinon.createSandbox();

describe("createNumberColumn", () => {
  it("should create table from a given class (with maxLength)", async () => {
    @Entity("users")
    class User {
      @Property()
      @MaxLength(200)
      prop: string;
    }

    const table = createTableStub(sandbox);
    await createColumns(table, User);

    expect(table.string).to.have.been.calledWithExactly("prop", 200);
  });

  it("should create table from a given class (without maxLength)", async () => {
    @Entity("users")
    class User {
      @Property()
      prop: string;
    }

    const table = createTableStub(sandbox);
    await createColumns(table, User);

    expect(table.string).to.have.been.calledWithExactly("prop", undefined);
  });
});
