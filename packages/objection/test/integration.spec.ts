import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Knex from "knex";
import {OBJECTION_CONNECTION} from "../src";
import {User} from "./helpers/models/User";
import {Server} from "./helpers/Server";

describe("Objection integrations", () => {
  before(() => {
    PlatformTest.create({
      knex: {
        client: "sqlite3",
        connection: ":memory:",
        migrations: {
          directory: `${__dirname}/helpers/migrations`
        },
        seeds: {
          directory: `${__dirname}/helpers/seeds`
        }
      }
    });
  });
  beforeEach(async () => {
    const conn = PlatformTest.injector.get<Knex>(OBJECTION_CONNECTION)!;
    await conn.migrate.latest();
    await conn.seed.run();
  });
  afterEach(() => {
    PlatformTest.bootstrap(Server, {
      knex: {
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true
      }
    });
  });
  after(async () => {
    const conn = PlatformTest.injector.get<Knex>(OBJECTION_CONNECTION)!;
    await conn.destroy();
  });

  it("should connect to the database", async () => {
    const conn = PlatformTest.injector.get<ReturnType<Knex>>(OBJECTION_CONNECTION)!;

    const user = await conn.table("users").where({id: 1}).first();
    expect(user.name).to.be.equal("John");
  });

  it("should be able to work with Objection.js Model", async () => {
    const user = await User.query().findById(1);
    expect(user.name).to.be.equal("John");
  });
});