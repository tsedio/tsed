import {AdapterModel} from "@tsed/adapters";
import {Opts} from "@tsed/di";

import {RedisAdapter, RedisAdapterConstructorOptions} from "./RedisAdapter.js";

const GRANTABLE = new Set(["AccessToken", "AuthorizationCode", "RefreshToken", "DeviceCode", "BackchannelAuthenticationRequest"]);
const CONSUMABLE = new Set(["AuthorizationCode", "RefreshToken", "DeviceCode", "BackchannelAuthenticationRequest"]);
type ChainableCommander = any;

export class OIDCRedisAdapter<T extends AdapterModel> extends RedisAdapter<T> {
  protected isGrantable: boolean;

  protected grantKeyFor(id: string) {
    return this.prefix(`$oidc:grant:${id}`);
  }

  protected userCodeKeyFor(userCode: string) {
    return this.prefix(`$oidc:userCode:${userCode}`);
  }

  protected uidKeyFor(uid: string) {
    return this.prefix(`$oidc:uid:${uid}`);
  }

  constructor(@Opts options: RedisAdapterConstructorOptions) {
    super(options);

    this.useHash = CONSUMABLE.has(this.collectionName);
    this.isGrantable = GRANTABLE.has(this.collectionName);
    this.hooks.on("insert", this.onInsert.bind(this));
  }

  async onInsert(multi: ChainableCommander, payload: T, expiresIn: number) {
    const id = payload._id;

    const key = this.key(id);

    if (this.isGrantable && payload.grantId) {
      const grantKey = this.grantKeyFor(payload.grantId);

      this.callCmd(multi, ["rPush", "rpush"], grantKey, key);
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await this.callCmd(this.db, ["ttl"], grantKey);

      if (expiresIn && expiresIn > ttl) {
        this.callCmd(multi, ["expire"], grantKey, expiresIn);
      }
    }

    if (payload.userCode) {
      const userCodeKey = this.userCodeKeyFor(payload.userCode);

      this.callCmd(multi, ["set"], userCodeKey, id);
      expiresIn && this.callCmd(multi, ["expire"], userCodeKey, expiresIn);
    }

    if (payload.uid) {
      const uidKey = this.uidKeyFor(payload.uid);

      this.callCmd(multi, ["set"], uidKey, id);
      expiresIn && this.callCmd(multi, ["expire"], uidKey, expiresIn);
    }

    return multi;
  }

  async findByUid(uid: string) {
    const id = await this.callCmd(this.db, ["get"], this.uidKeyFor(uid));

    return id && this.findById(id);
  }

  async findByUserCode(userCode: string) {
    const id = await this.callCmd(this.db, ["get"], this.userCodeKeyFor(userCode));
    return id && this.findById(id);
  }

  async destroy(id: string) {
    const key = this.key(id);
    await this.callCmd(this.db, ["del"], key);
  }

  async revokeByGrantId(grantId: string) {
    const multi = this.db.multi();
    const key = this.grantKeyFor(grantId);
    const tokens = await this.callCmd(this.db, ["lRange", "lrange"], key, 0, -1);

    tokens.forEach((token: string) => this.callCmd(multi, ["del"], token));
    this.callCmd(multi, ["del"], this.grantKeyFor(grantId));

    await this.callCmd(multi, ["exec"]);
  }

  async consume(id: string) {
    await this.callCmd(this.db, ["hSet", "hset"], this.key(id), "consumed", Math.floor(Date.now() / 1000));
  }
}
