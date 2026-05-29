import {Adapter, AdapterConstructorOptions, AdapterModel} from "@tsed/adapters";
import {cleanObject, isObject, isString} from "@tsed/core";
import {injectMany, Opts} from "@tsed/di";
import {Hooks} from "@tsed/hooks";
import {REDIS_CONNECTIONS, RedisConnection} from "@tsed/redis";
import {v4 as uuid} from "uuid";

type Redis = any;

export interface RedisAdapterConstructorOptions extends AdapterConstructorOptions {
  connectionName?: string;
  keyPrefix?: string;
  useHash?: boolean;
}

export class RedisAdapter<Model extends AdapterModel> extends Adapter<Model> {
  readonly hooks = new Hooks();
  readonly connectionName: string;
  readonly connection: RedisConnection;
  readonly keyPrefix: string;
  protected useHash: boolean = false;

  constructor(@Opts options: RedisAdapterConstructorOptions) {
    super(options as any);

    this.useHash = Boolean(options.useHash);
    this.connectionName = options.connectionName || "default";
    this.keyPrefix = options.keyPrefix || "";
    this.connection = injectMany<RedisConnection>(REDIS_CONNECTIONS).find((connection) => {
      return connection.name === this.connectionName;
    })!; // || connections[0];
  }

  get db(): Redis {
    return this.connection;
  }

  key(id: string) {
    return this.prefix(`${this.collectionName}:${id}`);
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

    const id = this.extractIdFromIndexedKey(foundKeys[0]);

    if (!id) {
      return undefined;
    }

    foundKeys = foundKeys.filter((key) => id === this.extractIdFromIndexedKey(key));

    return keys.length === foundKeys.length ? this.findById(id) : undefined;
  }

  async findById(_id: string): Promise<Model | undefined> {
    const key = this.key(_id);

    const item = this.useHash ? await this.callCmd(this.db, ["hGetAll", "hgetall"], key) : await this.callCmd(this.db, ["get"], key);

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

      await this.callCmd(this.db, ["del"], id, ...indexIds);

      return this.deserialize(item);
    }
  }

  public deleteById(_id: string): Promise<Model | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<Model>): Promise<Model[]> {
    const items = await this.findAll(predicate);
    const ids: string[] = [];
    const results = items.map((item) => {
      ids.push(this.key(item._id));
      return this.deserialize(item);
    });
    const indexesByItem = await Promise.all(items.map((item) => this.getAllIndex(item._id)));
    const indexKeys = indexesByItem.flat();

    if (ids.length || indexKeys.length) {
      await this.callCmd(this.db, ["del"], ...ids, ...indexKeys);
    }

    return results;
  }

  prefix(key: string) {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }

  protected callCmd(target: any, methods: string[], ...args: any[]) {
    const method = methods.map((name) => target?.[name]).find((fn) => typeof fn === "function");

    if (!method) {
      throw new Error(`Redis command not available: ${methods.join(" or ")}`);
    }

    return method.call(target, ...args);
  }

  protected extractIdFromIndexedKey(key: string) {
    const parts = key.split(":");
    const collectionIndex = parts.lastIndexOf(this.collectionName);

    return collectionIndex > -1 ? parts[collectionIndex + 1] : undefined;
  }

  protected async findKeys(props: any): Promise<string[]> {
    const keys: string[] = Object.keys(props);
    const patterns = this.indexes
      .filter(({propertyKey}) => keys.includes(propertyKey))
      .map(({propertyKey}) => this.getIndexedKey("*", propertyKey, props[propertyKey]));

    if (!patterns.length) {
      return [];
    }

    const results = await Promise.all(patterns.map((pattern) => this.callCmd(this.db, ["keys"], pattern)));
    return results.flat().filter(Boolean).sort();
  }

  protected async insert(payload: Partial<Model>, expiresAt?: Date) {
    const id = (payload._id = payload._id || uuid());

    const expiresIn = expiresAt ? expiresAt.getTime() - Date.now() : null;

    await this.validate(payload as Model);

    const multi = this.db.multi();
    const key = this.key(id);

    const strPayload = JSON.stringify(this.serialize(payload));

    if (this.useHash) {
      this.callCmd(multi, ["hSet", "hset"], key, {payload: strPayload});
    } else {
      this.callCmd(multi, ["set"], key, strPayload);
    }

    if (expiresIn) {
      this.callCmd(multi, ["expire"], key, expiresIn);
    }

    this.indexes.forEach(({propertyKey}) => {
      const value = payload[propertyKey];
      const indexedKey = this.getIndexedKey(id, propertyKey, value);

      this.callCmd(multi, ["set"], indexedKey, id);
      expiresIn && this.callCmd(multi, ["expire"], indexedKey, expiresIn);
    });

    await this.hooks.asyncAlter("insert", multi, [payload, expiresIn]);

    await this.callCmd(multi, ["exec"]);

    const result = this.deserialize(payload, {useAlias: false});

    await this.hooks.asyncEmit("afterInsert", [result]);

    return result;
  }

  protected getAllIndex(id: string): Promise<string[]> {
    const key = this.prefix(["$idx", `${this.collectionName}:${id}`, "*"].join(":"));
    return this.callCmd(this.db, ["keys"], key);
  }

  protected getIndexedKey(id: string, propertyKey: string, value: any): string {
    const key = `${this.collectionName}:${id}`;
    return this.prefix(["$idx", key, `${propertyKey}(${value})`].map(String).join(":"));
  }

  protected async getAll(): Promise<Model[]> {
    const keys = (await this.callCmd(this.db, ["keys"], this.prefix(`${this.collectionName}:*`))).sort();
    const result = await Promise.all(keys.map((key: string) => this.callCmd(this.db, ["get"], key)));

    return (result || [])
      .map((data: unknown) => (typeof data === "string" ? this.deserialize(JSON.parse(data)) : undefined))
      .filter(Boolean);
  }

  protected async findAllBy(props: Partial<Model & any>): Promise<Model[]> {
    const keys = Object.keys(props);
    const foundKeys = await this.findKeys(props);

    if (foundKeys.length < keys.length) {
      return [];
    }

    const map = foundKeys.reduce((map: Map<string, number>, key) => {
      const id = this.extractIdFromIndexedKey(key);
      if (!id) {
        return map;
      }
      const value = map.get(id) || 0;

      return map.set(id, value + 1);
    }, new Map());

    const promises = [...map.entries()].filter(([, num]) => num === keys.length).map(([id]) => this.findById(id));

    const result = await Promise.all(promises);

    return result.filter(Boolean) as Model[];
  }
}
