import {catchError} from "@tsed/core";
import {Decimal, Entity, IdColumn} from "@tsed/objection";
import {MaxLength, Property} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "./createColumns";

const sandbox = Sinon.createSandbox();

describe("createTable", () => {
  it("should create table from a given class (columns doesn't exists)", async () => {
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

    const table = createTableStub(sandbox);

    createColumns(table, User);

    expect(table.increments).to.have.been.calledWithExactly("id");
    expect(table.primary).to.have.been.calledWithExactly();
    expect(table.string).to.have.been.calledWithExactly("name", 200);
    expect(table.decimal).to.have.been.calledWithExactly("age", undefined, undefined);
    expect(table.decimal).to.have.been.calledWithExactly("score", 12, 1);
    expect(table.boolean).to.have.been.calledWithExactly("active");
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

    const table = createTableStub(sandbox);

    createColumns(table, User);
  });

  it("should throw error when type isn't supported", () => {
    @Entity("users")
    class User {
      @Property()
      date: any;
    }

    const table = createTableStub(sandbox);
    const error = catchError(() => createColumns(table, User));

    expect(error).to.eq("Column type object isn't supported. Add function to ColumnTypesContainer to map the column with Knex");
  });
});
