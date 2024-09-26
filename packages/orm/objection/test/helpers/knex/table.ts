import type {Knex} from "knex";

export function createTableStub() {
  return {
    increments: vi.fn().mockReturnThis(),
    bigIncrements: vi.fn().mockReturnThis(),
    primary: vi.fn().mockReturnThis(),
    string: vi.fn().mockReturnThis(),
    decimal: vi.fn().mockReturnThis(),
    boolean: vi.fn().mockReturnThis(),
    uuid: vi.fn().mockReturnThis(),
    defaultTo: vi.fn().mockReturnThis()
  } as unknown as Knex.TableBuilder;
}
