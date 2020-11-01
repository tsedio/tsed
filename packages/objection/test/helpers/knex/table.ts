import * as Knex from "knex";

export function createTableStub(sandbox: any) {
  return ({
    increments: sandbox.stub().returnsThis(),
    bigIncrements: sandbox.stub().returnsThis(),
    primary: sandbox.stub().returnsThis(),
    string: sandbox.stub().returnsThis(),
    decimal: sandbox.stub().returnsThis(),
    boolean: sandbox.stub().returnsThis()
  } as unknown) as Knex.TableBuilder;
}
