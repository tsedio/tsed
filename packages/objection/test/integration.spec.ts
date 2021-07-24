import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Knex from "knex";
import {serialize} from "@tsed/json-mapper";
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

  it("should serialize correctly the model", async () => {
    const user = await User.query().findById(1);

    const result = serialize(user, {type: User, groups: ['creation'], endpoint: true})

    expect(result).to.deep.eq({ name: 'John' })

    const result2 = serialize(user, {type: User, groups: [], endpoint: true})

    expect(result2).to.deep.eq({ id: 1, name: 'John' })

    const result3 = serialize(user, {type: User, groups: []})

    expect(result3).to.deep.eq({ id: 1, name: 'John' })
  });
});
