import type {Knex} from "knex";

export function seed(knex: Knex): Promise<any> {
  const userData = [
    {
      name: "John"
    },
    {
      name: "Jane"
    }
  ];
  return knex("users").insert(userData);
}
