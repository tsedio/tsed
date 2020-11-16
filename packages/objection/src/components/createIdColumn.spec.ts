import {Entity, IdColumn} from "@tsed/objection";
import {expect} from "chai";
import * as Knex from "knex";
import * as Sinon from "sinon";
import {createTableStub} from "../../test/helpers/knex/table";
import {createColumns} from "../utils/createColumns";

const sandbox = Sinon.createSandbox();

describe("createIdColumn", () => {
  it("should create table from a given class (bigIncrements)", async () => {
    @Entity("users")
    class User {
      @IdColumn("bigIncrements")
      id: number;
    }

    const table = createTableStub(sandbox);
    createColumns(table, User);

    expect(table.bigIncrements).to.have.been.calledWithExactly("id");
  });

  it("should create table from a given class (increments)", async () => {
    @Entity("users")
    class User {
      @IdColumn("increments")
      id: number;
    }

    const table = createTableStub(sandbox);
    createColumns(table, User);

    expect(table.increments).to.have.been.calledWithExactly("id");
  });
});
