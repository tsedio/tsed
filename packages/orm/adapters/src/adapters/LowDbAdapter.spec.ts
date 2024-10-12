import {faker} from "@faker-js/faker";
import {deserialize} from "@tsed/json-mapper";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Format, Name, Property} from "@tsed/schema";

import {Adapter, Adapters, MemoryAdapter} from "../../src/index.js";

class BaseClient {
  @Format("date-time")
  createdAt: Date;
}

class Client extends BaseClient {
  @Name("id")
  _id: string;

  @Property()
  name: string;
}

describe("MemoryAdapter", () => {
  let adapter: Adapter<Client>;
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  beforeEach(() => {
    adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<any>({
      collectionName: "clients",
      model: Client,
      adapter: MemoryAdapter
    });
  });

  describe("create()", () => {
    it("should create a new instance", async () => {
      const base = deserialize(
        {
          name: faker.person.firstName(),
          createdAt: faker.date.past()
        },
        {type: Client}
      );

      const client = await adapter.create(base);

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client.name).toBe(base.name);
      expect(client.createdAt).toEqual(base.createdAt);
    });

    it("should create a new instance with expireAt", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base, new Date());

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client.name).toBe(base.name);
    });
  });

  describe("upsert()", () => {
    it("should create a new instance if not exists", async () => {
      const base: any = {
        name: faker.person.firstName()
      };

      const client = await adapter.upsert(base._id, base);

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client.name).toBe(base.name);
    });

    it("should update instance if exists", async () => {
      const base: any = {
        name: faker.person.firstName()
      };

      const client = await adapter.upsert(base._id, base);
      const client2 = await adapter.upsert(client._id, client);

      expect(client2).toBeInstanceOf(Client);
      expect(typeof client2._id).toBe("string");
      expect(client2.name).toBe(base.name);
    });
  });

  describe("updateOne()", () => {
    it("should update an instance", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base);

      const update = {
        _id: client._id,
        name: faker.person.firstName()
      };

      const client2 = await adapter.updateOne({_id: client._id}, update);

      expect(client2).toBeInstanceOf(Client);
      expect(typeof client2?._id).toBe("string");
      expect(client2?.name).not.toBe(base.name);
      expect(client2?.name).toBe(update.name);
    });
    it("should return undefined", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.updateOne({_id: faker.string.uuid()}, base);

      expect(client).toBeUndefined();
    });
  });

  describe("findById()", () => {
    it("should find by ID", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base);
      const result = await adapter.findById(client._id);

      expect(result).toBeInstanceOf(Client);
      expect(result?._id).toBe(client._id);
      expect(result?.name).toBe(base.name);
    });
  });

  describe("findOne()", () => {
    it("should find one item", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        name: base.name
      });

      expect(result).toBeInstanceOf(Client);
      expect(result?._id).toBe(client._id);
      expect(result?.name).toBe(base.name);
    });
  });
  describe("findAll()", () => {
    it("should find all items", async () => {
      const base = {
        name: faker.person.firstName()
      };

      await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name
      });

      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0].name).toBe(base.name);
    });
  });
  describe("deleteById()", () => {
    it("should delete an item by id", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base);

      const result = await adapter.deleteById(client._id);

      expect(result).toBeInstanceOf(Client);
      expect(result?.name).toBe(base.name);
    });
  });
  describe("deleteMany()", () => {
    it("should delete many", async () => {
      const base = {
        name: faker.person.firstName()
      };

      const client = await adapter.create(base);

      await adapter.create({
        name: faker.person.firstName()
      });
      await adapter.create({
        name: faker.person.firstName()
      });

      const result = await adapter.deleteMany(client);

      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0]?.name).toBe(base.name);
    });
  });
});
