import {PlatformTest} from "@tsed/common";
import filedirname from "filedirname";
import {Knex} from "knex";
import {serialize} from "@tsed/json-mapper";
import {OBJECTION_CONNECTION} from "@tsed/objection";
import {User} from "./helpers/models/User.js";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

describe("Objection integrations", () => {
  beforeAll(() => {
    PlatformTest.create({
      knex: {
        client: "sqlite3",
        connection: ":memory:",
        migrations: {
          directory: `${rootDir}/helpers/migrations`
        },
        seeds: {
          directory: `${rootDir}/helpers/seeds`
        }
      }
    });
  });
  beforeEach(async () => {
    const conn = PlatformTest.injector.get<Knex>(OBJECTION_CONNECTION)!;
    await conn.migrate.latest();
    await conn.seed.run();
  });
  afterAll(async () => {
    const conn = PlatformTest.injector.get<Knex>(OBJECTION_CONNECTION)!;
    await conn.destroy();
  });

  it("should connect to the database", async () => {
    const conn = PlatformTest.injector.get<ReturnType<Knex>>(OBJECTION_CONNECTION)!;

    const user = await conn.table("users").where({id: 1}).first();
    expect(user.name).toBe("John");
  });

  it("should be able to work with Objection.js Model", async () => {
    const user = await User.query().findById(1);
    expect(user.name).toBe("John");
  });

  it("should serialize correctly the model", async () => {
    const user = await User.query().findById(1);

    const result = serialize(user, {type: User, groups: ["creation"], endpoint: true});

    expect(result).toEqual({name: "John"});

    const result2 = serialize(user, {type: User, groups: [], endpoint: true});

    expect(result2).toEqual({id: 1, name: "John"});

    const result3 = serialize(user, {type: User, groups: []});

    expect(result3).toEqual({id: 1, name: "John"});
  });
});
