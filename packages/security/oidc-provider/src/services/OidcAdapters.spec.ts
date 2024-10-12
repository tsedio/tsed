import {faker} from "@faker-js/faker";
import {PlatformTest} from "@tsed/platform-http/testing";
import type {Adapter} from "oidc-provider";

import {OidcAdapters} from "./OidcAdapters.js";

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
        const id = faker.string.uuid();

        await adapter.upsert(
          id,
          {
            client_id: id
          },
          20000
        );

        const obj: any = await adapter.find(id);

        expect(obj._id).toEqual(id);
        expect(obj.client_id).toEqual(id);
        expect(obj.expires_at).toBeInstanceOf(Date);

        await adapter.destroy(id);
      });
    });

    describe("adapter.findByUserCode()", () => {
      it("should find data by userCode", async () => {
        const id = faker.string.uuid();

        await adapter.upsert(
          id,
          {
            userCode: id
          },
          20000
        );

        const obj: any = await adapter.findByUserCode(id);

        expect(obj._id).toEqual(id);
        expect(obj.userCode).toEqual(id);
        expect(obj.expires_at).toBeInstanceOf(Date);
      });
    });
    describe("adapter.findByUid()", () => {
      it("should find data by uid", async () => {
        const id = faker.string.uuid();

        await adapter.upsert(
          id,
          {
            uid: id
          },
          20000
        );

        const obj: any = await adapter.findByUid(id);

        expect(obj._id).toEqual(id);
        expect(obj.uid).toEqual(id);
        expect(obj.expires_at).toBeInstanceOf(Date);
      });
    });
    describe("adapter.deleteMany()", () => {
      it("should delete items", async () => {
        const id = faker.string.uuid();

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

        expect(obj._id).toEqual(id);
        expect(obj.grantId).toEqual(id);
      });
    });
  });
});
