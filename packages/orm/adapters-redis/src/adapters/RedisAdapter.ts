import {Adapter, AdapterConstructorOptions, AdapterModel} from "@tsed/adapters";
import {cleanObject, isObject, isString} from "@tsed/core";
import {Configuration, Inject, Opts} from "@tsed/di";
import {Hooks} from "@tsed/hooks";
import {IORedis, IOREDIS_CONNECTIONS} from "@tsed/ioredis";
import type {ChainableCommander, Redis} from "ioredis";
import {v4 as uuid} from "uuid";

const getId = (key: string) => key.split(":")[2];
const flatKeys = (keys: [Error | null, string[]][]): string[] => {
  return keys.flatMap(([, result]) => result).filter(Boolean);
};

export interface RedisAdapterConstructorOptions extends AdapterConstructorOptions {
  connectionName?: string;
  useHash?: boolean;
}

export class RedisAdapter<Model extends AdapterModel> extends Adapter<Model> {
  readonly hooks = new Hooks();
  readonly connectionName: string;
  readonly connection: IORedis;
  protected useHash: boolean = false;

  constructor(
    @Opts options: RedisAdapterConstructorOptions,
    @Inject(IOREDIS_CONNECTIONS) connections: IORedis[],
    @Configuration() protected configuration: Configuration
  ) {
    super(options, configuration);

    this.useHash = Boolean(options.useHash);
    this.connectionName = options.connectionName || "default";
    this.connection = connections.find((connection) => connection.name === this.connectionName)!; // || connections[0];
  }

  get db(): Redis {
    return this.connection;
  }

  key(id: string) {
    return `${this.collectionName}:${id}`;
  }

  public create(payload: Partial<Model>, expiresAt?: Date): Promise<Model> {
    delete payload._id;
    return this.insert(payload, expiresAt);
  }

  public async upsert(id: string, payload: Model, expiresAt?: Date): Promise<Model> {
    const item = await this.findById(id);

    if (!item) {
      payload._id = id;

      return this.insert(payload, expiresAt);
    }

    return this.update(id, payload, expiresAt) as unknown as Promise<Model>;
  }

  public update(id: string, payload: Model, expiresAt?: Date): Promise<Model | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<Model & any>, payload: Model, expiresAt?: Date): Promise<Model | undefined> {
    const item = await this.findOne(predicate);

    if (!item) {
      return undefined;
    }

    Object.assign(item, cleanObject(payload), {
      _id: item._id
    });

    return this.insert(item, expiresAt);
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

    const getId = (key: string) => key.split(":")[2];
    const id = getId(foundKeys[0]);

    foundKeys = foundKeys.filter((key) => id === getId(key));

    return keys.length === foundKeys.length ? this.findById(id) : undefined;
  }

  async findById(_id: string): Promise<Model | undefined> {
    const key = this.key(_id);

    const item = this.useHash ? await this.db.hgetall(key) : await this.db.get(key);

    // hgetall returns an empty object when there are no results, so we need to check for that.
    if (!item || (this.useHash && isObject(item) && Object.keys(item).length === 0)) {
      return undefined;
    }

    if (isString(item)) {
      return this.deserialize(JSON.parse(item));
    }

    const {payload, ...rest} = item;

    return {
      ...rest,
      ...(payload ? JSON.parse(payload) : {})
    };
  }

  public async findAll(predicate: Partial<Model & any> = {}): Promise<Model[]> {
    const {_id, ...props} = predicate;

    if (_id) {
      const item = await this.findById(_id);
      return item ? [item] : [];
    }

    const keys = Object.keys(props);

    if (keys.length === 0) {
      return this.getAll();
    }

    return this.findAllBy(props);
  }

  public async deleteOne(predicate: Partial<Model & any>): Promise<Model | undefined> {
    const item = await this.findOne(predicate);

    if (item) {
      const id = this.key(item._id);
      const indexIds = await this.getAllIndex(item._id);

      await this.db.del([id, ...indexIds]);

      return this.deserialize(item);
    }
  }

  public deleteById(_id: string): Promise<Model | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<Model>): Promise<Model[]> {
    const items = await this.findAll(predicate);

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

  protected async findKeys(props: any): Promise<string[]> {
    const keys: any[] = Object.keys(props);
    const pipeline = this.db.pipeline();

    this.indexes
      .filter(({propertyKey}) => keys.includes(propertyKey))
      .forEach(({propertyKey}) => {
        const value = props[propertyKey];
        const patterns = this.getIndexedKey("*", propertyKey, value);

        pipeline.keys(patterns);
      });

    const results = await pipeline.exec();

    return flatKeys(results as any[]);
  }

  protected async insert(payload: Partial<Model>, expiresAt?: Date) {
    const id = (payload._id = payload._id || uuid());

    const expiresIn = expiresAt ? expiresAt.getTime() - Date.now() : null;

    await this.validate(payload as Model);

    const multi = this.db.multi();
    const key = this.key(id);

    const strPayload = JSON.stringify(this.serialize(payload));

    this.useHash ? await multi.hset(key, {payload: strPayload}) : await multi.set(key, strPayload);

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    this.indexes.forEach(({propertyKey}) => {
      const value = payload[propertyKey];
      const indexedKey = this.getIndexedKey(id, propertyKey, value);

      multi.set(indexedKey, id);
      expiresIn && multi.expire(indexedKey, expiresIn);
    });

    await this.hooks.asyncAlter("insert", multi, [payload, expiresIn]);

    await multi.exec();

    const result = this.deserialize(payload, {useAlias: false});

    await this.hooks.asyncEmit("afterInsert", [result]);

    return result;
  }

  protected getAllIndex(id: string): Promise<string[]>;
  protected getAllIndex(id: string, pipeline: ChainableCommander): ChainableCommander;
  protected getAllIndex(id: string, pipeline?: ChainableCommander) {
    const key = ["$idx", this.key(id), "*"].join(":");

    return (pipeline || this.db).keys(key);
  }

  protected getIndexedKey(id: string, propertyKey: string, value: any): string {
    const key = this.key(id);
    return ["$idx", key, `${propertyKey}(${value})`].map(String).join(":");
  }

  protected async getAll(): Promise<Model[]> {
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
