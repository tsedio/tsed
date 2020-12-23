import {Adapter, Adapters} from "@tsed/adapters";
import {Inject, Injectable} from "@tsed/di";
import {Adapter as OidcAdapter, AdapterConstructor} from "oidc-provider";

@Injectable()
export class OidcAdapters {
  @Inject()
  protected adapters: Adapters;

  createAdapterClass(): AdapterConstructor {
    const self = this;

    return class CustomAdapter implements OidcAdapter {
      adapter: Adapter<any>;

      constructor(name: string) {
        this.adapter = self.adapters.invokeAdapter<any>(name, Object);
      }

      async upsert(id: string, payload: any, expiresIn: number): Promise<void> {
        let expiresAt;

        if (expiresIn) {
          expiresAt = new Date(Date.now() + expiresIn * 1000);
        }

        await this.adapter.upsert(id, payload, expiresAt);
      }

      async find(id: string) {
        return this.adapter.findById(id);
      }

      async findByUserCode(userCode: string) {
        return this.adapter.findOne({
          userCode
        });
      }

      async findByUid(uid: string) {
        return this.adapter.findOne({
          uid
        });
      }

      async destroy(id: string) {
        await this.adapter.deleteById(id);
      }

      async revokeByGrantId(grantId: string) {
        await this.adapter.deleteMany({grantId});
      }

      async consume(grantId: string) {
        await this.adapter.update(grantId, {consumed: Math.floor(Date.now() / 1000)});
      }
    };
  }
}
