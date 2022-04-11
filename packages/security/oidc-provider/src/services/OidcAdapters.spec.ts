import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import faker from "@faker-js/faker";
import {Adapter} from "oidc-provider";
import {OidcAdapters} from "./OidcAdapters";

describe("OidcAdapters", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("createAdapterClass()", () => {
    let adapter: Adapter;

    beforeEach(async () => {
      const oidcAdapters = await PlatformTest.invoke<OidcAdapters>(OidcAdapters);
      adapter = new (oidcAdapters.createAdapterClass())("clients");
    });

    describe("adapter.upsert()", () => {
      it("should call upsert", async () => {
        const id = faker.datatype.uuid();

        await adapter.upsert(
          id,
          {
            client_id: id
          },
          20000
        );

        const obj: any = await adapter.find(id);

        expect(obj._id).to.deep.equal(id);
        expect(obj.client_id).to.deep.equal(id);
        expect(obj.expires_at).to.be.a("date");

        await adapter.destroy(id);
      });
    });

    describe("adapter.findByUserCode()", () => {
      it("should find data by userCode", async () => {
        const id = faker.datatype.uuid();

        await adapter.upsert(
          id,
          {
            userCode: id
          },
          20000
        );

        const obj: any = await adapter.findByUserCode(id);

        expect(obj._id).to.deep.equal(id);
        expect(obj.userCode).to.deep.equal(id);
        expect(obj.expires_at).to.be.a("date");
      });
    });
    describe("adapter.findByUid()", () => {
      it("should find data by uid", async () => {
        const id = faker.datatype.uuid();

        await adapter.upsert(
          id,
          {
            uid: id
          },
          20000
        );

        const obj: any = await adapter.findByUid(id);

        expect(obj._id).to.deep.equal(id);
        expect(obj.uid).to.deep.equal(id);
        expect(obj.expires_at).to.be.a("date");
      });
    });

    describe("adapter.deleteMany()", () => {
      it("should delete items", async () => {
        const id = faker.datatype.uuid();

        await adapter.upsert(
          id,
          {
            grantId: id
          },
          20000
        );

        await adapter.consume(id);
        const obj: any = await adapter.find(id);
        await adapter.revokeByGrantId(id);

        expect(obj._id).to.deep.equal(id);
        expect(obj.grantId).to.deep.equal(id);
      });
    });
  });
});
