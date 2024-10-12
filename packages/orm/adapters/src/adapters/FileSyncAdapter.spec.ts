import {faker} from "@faker-js/faker";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Property} from "@tsed/schema";

import {Adapter} from "../domain/Adapter.js";
import {Adapters} from "../services/Adapters.js";
import {FileSyncAdapter} from "./FileSyncAdapter.js";

class Client {
  @Property()
  _id: string;

  @Property()
  name: string;
}

describe("FileSyncAdapter", () => {
  describe("writable", () => {
    let adapter: Adapter<Client>;
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    beforeEach(() => {
      adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<any>({
        collectionName: "clients",
        model: Client,
        adapter: FileSyncAdapter
      });
    });

    afterAll(async () => {
      await adapter.deleteMany({});
    });

    describe("create()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
        };

        const client = await adapter.create(base);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client.name).toBe(base.name);
      });
    });

    describe("findById()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
        };

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
    });

    describe("findOne()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
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
    describe("deleteOne()", () => {
      it("should delete instance", async () => {
        const base = {
          name: faker.person.jobTitle()
        };

        const client = await adapter.create(base);

        const result = await adapter.deleteOne({
          name: base.name
        });

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);

        const result2 = await adapter.deleteOne({
          name: base.name
        });
        expect(result2).toBeUndefined();
      });
    });
  });
  describe("readOnly", () => {
    let adapter: Adapter<Client>;
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    beforeEach(() => {
      adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<any>({
        collectionName: "clients",
        model: Client,
        readOnly: true,
        adapter: FileSyncAdapter
      });
    });

    afterAll(async () => {
      await adapter.deleteMany({});
    });

    describe("create()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
        };

        const client = await adapter.create(base);

        expect(client).toBeInstanceOf(Client);
        expect(typeof client._id).toBe("string");
        expect(client.name).toBe(base.name);
      });
    });

    describe("findById()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
        };

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).toBeInstanceOf(Client);
        expect(result?._id).toBe(client._id);
        expect(result?.name).toBe(base.name);
      });
    });

    describe("findOne()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.person.jobTitle()
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
  });
});
