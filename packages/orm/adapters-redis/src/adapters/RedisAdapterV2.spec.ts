import {AdapterModel, Adapters, Indexed, RevisionAdapterModel} from "@tsed/adapters";
import {LocalsContainer} from "@tsed/common";
import {IORedisTest, registerConnectionProvider} from "@tsed/ioredis";
import {deserialize} from "@tsed/json-mapper";
import {Property, Required} from "@tsed/schema";

import {RedisAdapterV2} from "./RedisAdapterV2";

class Client extends RevisionAdapterModel {
  @Property()
  _id: string;

  @Indexed()
  name: string;

  @Property()
  @Required()
  secret: string;
}
const TEST_REDIS_CONNECTION = Symbol.for("test_redis_connection");

registerConnectionProvider({
  provide: TEST_REDIS_CONNECTION
});

async function createAdapterFixture<Model extends AdapterModel = Client>({
  collectionName = "client",
  model = Client
}: {collectionName?: string; model?: any} = {}) {
  const locals = new LocalsContainer();

  const adapter = IORedisTest.get<Adapters>(Adapters).invokeAdapter<Model>({
    collectionName,
    model,
    adapter: RedisAdapterV2,
    locals,
    useHash: false
  }) as RedisAdapterV2<Model>;

  const hashAdapter = IORedisTest.get<Adapters>(Adapters).invokeAdapter<Model>({
    collectionName,
    model,
    adapter: RedisAdapterV2,
    locals,
    useHash: true
  }) as RedisAdapterV2<Model>;

  return {adapter, hashAdapter};
}

describe("RedisAdapterCustom", () => {
  beforeEach(() => IORedisTest.create());
  afterEach(() => IORedisTest.reset());
  describe("useHash = false", () => {
    describe("create()", () => {
      it("should create a new instance", async () => {
        const {adapter} = await createAdapterFixture();

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base, new Date(Date.now() + 3000));

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client.name).toBe(base.name);

        const keys = await adapter.db.keys("*");

        expect(keys).toContain("client:" + client._id);
        expect(keys).toContain(`$idx:client:${client._id}:name(${base.name})`);
      });
    });
    describe("upsert()", () => {
      it("should upsert a new instance", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );
        const id = "uuid";

        const client = await adapter.upsert(id, base);
        const client2 = await adapter.upsert(id, base);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(client2._id);
        expect(client.name).toBe(base.name);

        const keys = await adapter.db.keys("*");

        expect(keys).toContain("client:" + client._id);
        expect(keys).toContain(`$idx:client:${client._id}:name(${base.name})`);
      });
    });
    describe("findById()", () => {
      it("should find item by id (get)", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should find item by id (hgetall)", async () => {
        const {adapter} = await createAdapterFixture<any>({
          collectionName: "AuthorizationCode",
          model: Object
        });

        const base = {
          key: "value"
        };

        const token = await adapter.create(base);
        const result = await adapter.findById(token._id);

        expect(result.key).toEqual(token.key);
      });
    });
    describe("findOne()", () => {
      it("should find instance", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name
        });

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should find instance by id", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          _id: client._id,
          name: base.name
        });

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should not find data", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name,
          otherProp: base.otherProp
        });

        expect(result).toBeUndefined();
      });
    });
    describe("findAll()", () => {
      it("should find all data (one prop)", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findAll({
          name: base.name
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should find all by id (one prop)", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findAll({
          _id: client._id
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should find all items", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );
        const client = await adapter.create(base);

        const result = await adapter.findAll({});

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should not find data when predicate has an unknown prop", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret",
            otherProp: "name"
          },
          {type: Client}
        );

        await adapter.create(base);

        const result = await adapter.findAll({
          name: base.name,
          otherProp: base.otherProp
        });

        expect(result).toEqual([]);
      });
    });
    describe("updateOne()", () => {
      it("should update one item and merge props (undefined props are filtered)", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const majItem = deserialize<Client>(
          {
            name: "name"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.updateOne(
          {
            name: base.name
          },
          majItem
        );

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
        expect(client.secret).toBe("secret");
      });
      it("should not update item", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.updateOne(
          {
            name: `${base.name}2`
          },
          base
        );

        expect(result).toBeUndefined();
        expect(client.name).toBe(base.name);
      });
    });
    describe("deleteOne()", () => {
      it("should remove one item", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteOne({
          name: base.name
        });

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
      });
      it("should not remove item", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteOne({
          name: `${base.name}2`
        });

        expect(result).toBeUndefined();
        expect(client.name).toBe(base.name);
      });
    });
    describe("deleteById()", () => {
      it("should remove one item", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteById(client._id);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
      });
    });
    describe("deleteMany()", () => {
      it("should remove items", async () => {
        const {adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteMany({
          name: base.name
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(typeof result[0]._id).toBe("string");
        expect(result[0]._id).toBe(client?._id);
        expect(result[0].name).toBe(base.name);
      });
    });
  });
  describe("useHash = true", () => {
    describe("create()", () => {
      it("should create a new instance", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture();

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base, new Date(Date.now() + 3000));

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client.name).toBe(base.name);

        const actual = await adapter.db.hget("client", client._id);
        expect(JSON.parse(actual!)).toEqual(client);
        expect(await adapter.db.hget("client:name", client.name)).toEqual(client._id);
      });
    });
    describe("upsert()", () => {
      it("should upsert a new instance", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );
        const id = "uuid";

        const client = await adapter.upsert(id, base);
        const client2 = await adapter.upsert(id, base);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(client2._id);
        expect(client.name).toBe(base.name);

        const actual = await adapter.db.hget("client", client._id);
        expect(JSON.parse(actual!)).toEqual({...client, modified: expect.any(Number)});
        expect(await adapter.db.hget("client:name", client.name)).toEqual(client._id);
      });
    });
    describe("findById()", () => {
      it("should find item by id (get)", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should find item by id (hgetall)", async () => {
        const {adapter} = await createAdapterFixture<any>({
          collectionName: "AuthorizationCode",
          model: Object
        });

        const base = {
          key: "value"
        };

        const token = await adapter.create(base);
        const result = await adapter.findById(token._id);

        expect(result.key).toEqual(token.key);
      });
    });
    describe("findOne()", () => {
      it("should find instance", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name
        });

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should find instance by id", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          _id: client._id,
          name: base.name
        });

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
      it("should not find data", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name,
          otherProp: base.otherProp
        });

        expect(result).toBeUndefined();
      });
    });
    describe("findAll()", () => {
      it("should find all data (one prop)", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findAll({
          name: base.name
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should find all by id (one prop)", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findAll({
          _id: client._id
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should find all by unexisting id", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        await adapter.create(base);

        const result = await adapter.findAll({
          _id: "toto"
        });

        expect(result.length).toEqual(0);
      });
      it("should find all items", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);

        const result = await adapter.findAll({});

        expect(result[0]).toBeInstanceOf(Client);
        expect(result[0]?._id).toBe(client._id);
        expect(result[0]?.name).toBe(base.name);
      });
      it("should not find data when predicate has an unknown prop", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize(
          {
            name: "name",
            secret: "secret",
            otherProp: "name"
          },
          {type: Client}
        );

        await adapter.create(base);

        const result = await adapter.findAll({
          name: base.name,
          otherProp: base.otherProp
        });

        expect(result).toEqual([]);
      });
    });
    describe("updateOne()", () => {
      it("should update one item and merge props (undefined props are filtered)", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const majItem = deserialize<Client>(
          {
            name: "name"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.updateOne(
          {
            name: base.name
          },
          majItem
        );

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
        expect(client.secret).toBe("secret");
      });
      it("should not update item", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.updateOne(
          {
            name: `${base.name}2`
          },
          base
        );

        expect(result).toBeUndefined();
        expect(client.name).toBe(base.name);
      });
    });
    describe("deleteOne()", () => {
      it("should remove one item", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteOne({
          name: base.name
        });

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
        expect(await adapter.db.hget("client", client._id)).toBeNull();
        expect(await adapter.db.hget("client:name", client.name)).toBeNull();
      });
      it("should not remove item", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteOne({
          name: `${base.name}2`
        });

        expect(result).toBeUndefined();
        expect(client.name).toBe(base.name);
        const actual = await adapter.db.hget("client", client._id);
        expect(JSON.parse(actual!)).toEqual(client);
        expect(await adapter.db.hget("client:name", client.name)).toEqual(client._id);
      });
    });
    describe("deleteById()", () => {
      it("should remove one item", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteById(client._id);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client._id).toBe(result?._id);
        expect(client.name).toBe(base.name);
        expect(await adapter.db.hget("client", client._id)).toBeNull();
        expect(await adapter.db.hget("client:name", client.name)).toBeNull();
      });
    });
    describe("deleteMany()", () => {
      it("should remove items", async () => {
        const {hashAdapter: adapter} = await createAdapterFixture({});

        const base = deserialize<Client>(
          {
            name: "name",
            secret: "secret"
          },
          {type: Client}
        );

        const client = await adapter.create(base);
        const result = await adapter.deleteMany({
          name: base.name
        });

        expect(result[0]).toBeInstanceOf(Client);
        expect(typeof result[0]._id).toBe("string");
        expect(result[0]._id).toBe(client?._id);
        expect(result[0].name).toBe(base.name);
        expect(await adapter.db.hlen("client")).toEqual(0);
        expect(await adapter.db.hlen("client:name")).toEqual(0);
      });
    });
  });
});
