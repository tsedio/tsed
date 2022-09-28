import {Knex} from "knex";

export function createTableStub() {
  return {
    increments: jest.fn().mockReturnThis(),
    bigIncrements: jest.fn().mockReturnThis(),
    primary: jest.fn().mockReturnThis(),
    string: jest.fn().mockReturnThis(),
    decimal: jest.fn().mockReturnThis(),
    boolean: jest.fn().mockReturnThis(),
    uuid: jest.fn().mockReturnThis(),
    defaultTo: jest.fn().mockReturnThis()
  } as unknown as Knex.TableBuilder;
}
