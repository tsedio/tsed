import {Adapter, Adapters, FileSyncAdapter} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import * as faker from "faker";

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

    after(async () => {
      await adapter.deleteMany({});
    });

    describe("create()", async () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);

        expect(client).to.be.instanceOf(Client);
        expect(client._id).to.be.a("string");
        expect(client.name).to.equal(base.name);
      });
    });

    describe("findById()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).to.be.instanceOf(Client);
        expect(result?._id).to.equal(client._id);
        expect(result?.name).to.equal(base.name);
      });
    });

    describe("findOne()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name
        });

        expect(result).to.be.instanceOf(Client);
        expect(result?._id).to.equal(client._id);
        expect(result?.name).to.equal(base.name);
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

    after(async () => {
      await adapter.deleteMany({});
    });

    describe("create()", async () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);

        expect(client).to.be.instanceOf(Client);
        expect(client._id).to.be.a("string");
        expect(client.name).to.equal(base.name);
      });
    });

    describe("findById()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);
        const result = await adapter.findById(client._id);

        expect(result).to.be.instanceOf(Client);
        expect(result?._id).to.equal(client._id);
        expect(result?.name).to.equal(base.name);
      });
    });

    describe("findOne()", () => {
      it("should create a new instance", async () => {
        const base = {
          name: faker.name.title()
        };

        const client = await adapter.create(base);

        const result = await adapter.findOne({
          name: base.name
        });

        expect(result).to.be.instanceOf(Client);
        expect(result?._id).to.equal(client._id);
        expect(result?.name).to.equal(base.name);
      });
    });
  });
});
