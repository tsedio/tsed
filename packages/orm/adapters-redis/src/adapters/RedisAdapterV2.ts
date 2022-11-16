import {AdapterModel} from "@tsed/adapters";
import {isString} from "@tsed/core";
import {Configuration, Inject, Opts} from "@tsed/di";
import {IORedis, IOREDIS_CONNECTIONS} from "@tsed/ioredis";
import {ChainableCommander} from "ioredis";
import {v4 as uuid} from "uuid";
import {RedisAdapter, RedisAdapterConstructorOptions} from "./RedisAdapter";

const getId = (key: string) => key.split(":")[2];
const flatKeys = (keys: [Error | null, string[]][]): string[] => {
  return keys.flatMap(([, result]) => result).filter(Boolean);
};

export class RedisAdapterV2<Model extends AdapterModel> extends RedisAdapter<Model> {
  constructor(
    @Opts options: RedisAdapterConstructorOptions,
    @Inject(IOREDIS_CONNECTIONS) connections: IORedis[],
    @Configuration() protected configuration: Configuration
  ) {
    super({...options, useHash: options.useHash === undefined ? true : options.useHash}, connections, configuration);
  }

  async findOne(predicate: Partial<Model & any>): Promise<Model | undefined> {
    const {_id, ...props} = predicate;

    if (_id) {
      return this.findById(_id);
    }

    const keys = Object.keys(props);
    let foundKeys = await this.findKeys(props);

    if (foundKeys.length < keys.length) {
      return undefined;
    }

    if (this.useHash) {
      return this.findById(foundKeys[0]);
    }

    const getId = (key: string) => key.split(":")[2];
    const id = getId(foundKeys[0]);

    foundKeys = foundKeys.filter((key) => id === getId(key));

    return keys.length === foundKeys.length ? this.findById(id) : undefined;
  }

  async findById(_id: string): Promise<Model | undefined> {
    const key = this.key(_id);

    const item = this.useHash ? await this.db.hget(this.collectionName, _id) : await this.db.get(key);

    if (!item) {
      return undefined;
    }

    if (isString(item)) {
      return this.deserialize(JSON.parse(item));
    }

    // @ts-ignore
    const {payload, ...rest} = item;

    return {
      ...rest,
      ...(payload ? JSON.parse(payload) : {})
    };
  }

  public async deleteOne(predicate: Partial<Model & any>): Promise<Model | undefined> {
    const item = await this.findOne(predicate);

    if (item) {
      if (this.useHash) {
        const pipeline = this.db.pipeline();
        const indexIds = await this.getAllIndex(item._id);

        pipeline.hdel(this.collectionName, item._id);
        indexIds.forEach((index) => {
          pipeline.hdel(index, item[index.split(":")[1]]);
        });

        await pipeline.exec();
      } else {
        const id = this.key(item._id);
        const indexIds = await this.getAllIndex(item._id);

        await this.db.del([id, ...indexIds]);
      }

      return this.deserialize(item);
    }
  }

  public async deleteById(_id: string): Promise<Model | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<Model>): Promise<Model[]> {
    const items = await this.findAll(predicate);

    if (this.useHash) {
      await Promise.all(items.map((item) => this.deleteOne({_id: item._id})));
      return items;
    }

    const pipeline = this.db.pipeline();
    const ids: string[] = [];

    const results = items.map((item) => {
      ids.push(this.key(item._id));

      this.getAllIndex(item._id, pipeline);

      return this.deserialize(item);
    });

    const keys = await pipeline.exec();

    this.db.del([...ids, ...flatKeys(keys as any)]);

    return results;
  }

  public async insert(payload: Partial<Model>, expiresAt?: Date) {
    const id = (payload._id = payload._id || uuid());

    const expiresIn = expiresAt ? Math.round((expiresAt.getTime() - Date.now()) / 1000) : null;

    await this.validate(payload as Model);

    const multi = this.db.multi();
    const strPayload = JSON.stringify(this.serialize(payload));

    if (this.useHash) {
      multi.hset(this.collectionName, id, strPayload);
    } else {
      const key = this.key(id);
      multi.set(key, strPayload);

      if (expiresIn) {
        multi.expire(key, expiresIn);
      }
    }

    this.indexes.forEach(({propertyKey}) => {
      const value = payload[propertyKey];

      if (this.useHash) {
        const key = this.collectionName + ":" + propertyKey;

        multi.hset(key, value!, id);
      } else {
        const indexedKey = this.getIndexedKey(id, propertyKey, value);

        multi.set(indexedKey, id);
        expiresIn && multi.expire(indexedKey, expiresIn);
      }
    });

    await this.hooks.asyncAlter("insert", multi, [payload, expiresIn]);

    await multi.exec();

    const result = this.deserialize(payload, {useAlias: false});

    await this.hooks.asyncEmit("afterInsert", [result]);

    return result;
  }

  protected async findKeys(props: any): Promise<string[]> {
    const keys: any[] = Object.keys(props);
    const pipeline = this.db.pipeline();

    this.indexes
      .filter(({propertyKey}) => keys.includes(propertyKey))
      .forEach(({propertyKey}) => {
        const value = props[propertyKey];
        if (this.useHash) {
          pipeline.hget(this.collectionName + ":" + propertyKey, value);
        } else {
          const patterns = this.getIndexedKey("*", propertyKey, value);

          pipeline.keys(patterns);
        }
      });

    const results = await pipeline.exec();

    return flatKeys(results as any[]);
  }

  protected getAllIndex(id: string): Promise<string[]>;
  protected getAllIndex(id: string, pipeline: ChainableCommander): ChainableCommander;
  protected getAllIndex(id: string, pipeline?: ChainableCommander) {
    if (this.useHash) {
      return this.indexes.map((index) => {
        return this.collectionName + ":" + index.propertyKey;
      });
    }
    const key = ["$idx", this.key(id), "*"].join(":");

    return (pipeline || this.db).keys(key);
  }

  protected getIndexedKey(id: string, propertyKey: string, value: any): string {
    const key = this.key(id);
    return ["$idx", key, `${propertyKey}(${value})`].map(String).join(":");
  }

  protected async getAll(): Promise<Model[]> {
    if (this.useHash) {
      const data = await this.db.hgetall(this.collectionName);

      return Object.values(data)
        .map((item) => this.deserialize(JSON.parse(item)))
        .filter(Boolean);
    }

    const keys = await this.db.keys(`${this.collectionName}:*`);
    const pipeline = this.db.pipeline();

    keys.forEach((key) => {
      pipeline.get(key);
    });

    const result = await pipeline.exec();

    return (result || []).map(([, data]: [any, string]) => this.deserialize(JSON.parse(data))).filter(Boolean);
  }

  protected async findAllBy(props: Partial<Model & any>): Promise<Model[]> {
    const keys = Object.keys(props);
    const foundKeys = await this.findKeys(props);

    if (foundKeys.length < keys.length) {
      return [];
    }

    if (this.useHash) {
      const result = await Promise.all(foundKeys.map((key) => this.findById(key)));
      return result as Model[];
    }

    const map = foundKeys.reduce((map: Map<string, number>, key) => {
      const id = getId(key);
      const value = map.get(id) || 0;

      return map.set(id, value + 1);
    }, new Map());

    const promises = [...map.entries()].filter(([, num]) => num === keys.length).map(([id]) => this.findById(id));

    const result = await Promise.all(promises);

    return result.filter(Boolean) as Model[];
  }
}
