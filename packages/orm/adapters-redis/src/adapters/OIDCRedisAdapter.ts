import {AdapterModel} from "@tsed/adapters";
import {Configuration, Inject, Opts} from "@tsed/di";
import {IORedis, IOREDIS_CONNECTIONS} from "@tsed/ioredis";
import {ChainableCommander} from "ioredis";

import {RedisAdapter, RedisAdapterConstructorOptions} from "./RedisAdapter.js";

const GRANTABLE = new Set(["AccessToken", "AuthorizationCode", "RefreshToken", "DeviceCode", "BackchannelAuthenticationRequest"]);
const CONSUMABLE = new Set(["AuthorizationCode", "RefreshToken", "DeviceCode", "BackchannelAuthenticationRequest"]);

function grantKeyFor(id: string) {
  return `$oidc:grant:${id}`;
}

function userCodeKeyFor(userCode: string) {
  return `$oidc:userCode:${userCode}`;
}

function uidKeyFor(uid: string) {
  return `$oidc:uid:${uid}`;
}

export class OIDCRedisAdapter<T extends AdapterModel> extends RedisAdapter<T> {
  protected isGrantable: boolean;

  constructor(
    @Opts options: RedisAdapterConstructorOptions,
    @Inject(IOREDIS_CONNECTIONS) connections: IORedis[],
    @Configuration() protected configuration: Configuration
  ) {
    super(options, connections, configuration);

    this.useHash = CONSUMABLE.has(this.collectionName);
    this.isGrantable = GRANTABLE.has(this.collectionName);
    this.hooks.on("insert", this.onInsert.bind(this));
  }

  async onInsert(multi: ChainableCommander, payload: T, expiresIn: number) {
    const id = payload._id;

    const key = this.key(id);

    if (this.isGrantable && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId);

      multi.rpush(grantKey, key);
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await this.db.ttl(grantKey);

      if (expiresIn && expiresIn > ttl) {
        multi.expire(grantKey, expiresIn);
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode);

      multi.set(userCodeKey, id);
      expiresIn && multi.expire(userCodeKey, expiresIn);
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid);

      multi.set(uidKey, id);
      expiresIn && multi.expire(uidKey, expiresIn);
    }

    return multi;
  }

  async findByUid(uid: string) {
    const id = await this.db.get(uidKeyFor(uid));

    return id && this.findById(id);
  }

  async findByUserCode(userCode: string) {
    const id = await this.db.get(userCodeKeyFor(userCode));
    return id && this.findById(id);
  }

  async destroy(id: string) {
    const key = this.key(id);
    await this.db.del(key);
  }

  async revokeByGrantId(grantId: string) {
    const multi = this.db.multi();
    const key = grantKeyFor(grantId);
    const tokens = await this.db.lrange(key, 0, -1);

    tokens.forEach((token) => multi.del(token));
    multi.del(grantKeyFor(grantId));

    await multi.exec();
  }

  async consume(id: string) {
    await this.db.hset(this.key(id), "consumed", Math.floor(Date.now() / 1000));
  }
}
