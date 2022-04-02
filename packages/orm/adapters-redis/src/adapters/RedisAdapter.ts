import {Adapter, AdapterModel} from "@tsed/adapters";
import {Inject} from "@tsed/di";
import IoRedis from "ioredis";
import type {Redis} from "ioredis";
import {v4 as uuid} from "uuid";
import "../services/RedisFactory";

export class RedisAdapter<T extends AdapterModel> extends Adapter<T> {
  @Inject(IoRedis)
  readonly db: Redis;

  key(id: string) {
    return `${this.collectionName}:${id}`;
  }

  public async create(payload: Partial<T>, expiresAt?: Date): Promise<T> {
    payload._id = uuid();

    return this.insert(payload, expiresAt);
  }

  public async upsert(id: string, payload: T, expiresAt?: Date): Promise<T> {
    let item = await this.findById(id);

    if (!item) {
      payload = {...payload, _id: id};

      return this.insert(payload, expiresAt);
    }

    return (await this.update(id, payload, expiresAt)) as T;
  }

  public async update(id: string, payload: T, expiresAt?: Date): Promise<T | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<T & any>, payload: T, expiresAt?: Date): Promise<T | undefined> {
    const item = await this.findOne(predicate);

    if (!item) {
      return undefined;
    }

    return this.insert(
      {
        ...this.updateInstance(item, payload),
        _id: item._id
      },
      expiresAt
    );
  }

  async findOne(predicate: Partial<T & any>): Promise<T | undefined> {
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

  async findById(_id: string): Promise<T | undefined> {
    const item = await this.db.get(this.key(_id));

    if (!item) {
      return undefined;
    }

    return this.deserialize(JSON.parse(item));
  }

  public async findAll(predicate: Partial<T & any> = {}): Promise<T[]> {
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

  public async deleteOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = await this.findOne(predicate);

    if (item) {
      await Promise.all([this.db.del(this.key(item._id)), this.cleanIndexes(item._id)]);

      return this.deserialize(item);
    }
  }

  public async deleteById(_id: string): Promise<T | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<T>): Promise<T[]> {
    const items = await this.findAll(predicate);

    const promises = items.map(async (item) => {
      await Promise.all([this.db.del(this.key(item._id)), this.cleanIndexes(item._id)]);

      return this.deserialize(item);
    });

    return Promise.all(promises);
  }

  protected async findKeys(props: any): Promise<string[]> {
    const keys: any[] = Object.keys(props);

    const promises = this.indexes
      .filter(({propertyKey}) => keys.includes(propertyKey))
      .map(({propertyKey}) => {
        const value = props[propertyKey];
        const patterns = this.getIndexedKey("*", propertyKey, value);

        return this.db.keys(patterns);
      });

    const result = await Promise.all(promises);

    return result.reduce((keys: string[], input: string[]) => keys.concat(input), []).filter(Boolean);
  }

  protected async insert(payload: Partial<T>, expiresAt?: Date) {
    const id = (payload._id = payload._id || uuid());

    const expiresIn = expiresAt ? Date.now() - expiresAt.getTime() : null;

    await this.validate(payload as T);

    const multi = this.db.multi();
    const key = this.key(id);

    await multi.set(key, JSON.stringify(this.serialize(payload)));

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    this.indexes.forEach(({propertyKey}) => {
      const value = payload[propertyKey];
      const indexedKey = this.getIndexedKey(id, propertyKey, value);

      multi.set(indexedKey, id);
      expiresIn && multi.expire(indexedKey, expiresIn);
    });

    await multi.exec();

    return this.deserialize(payload);
  }

  protected async cleanIndexes(id: string) {
    const key = ["$idx", this.key(id), "*"].join(":");

    const keys = await this.db.keys(key);

    return this.db.del(...keys);
  }

  protected getIndexedKey(id: string, propertyKey: string, value: any): string {
    const key = this.key(id);
    return ["$idx", key, `${propertyKey}(${value})`].map(String).join(":");
  }

  protected async getAll(): Promise<T[]> {
    const keys = await this.db.keys(`${this.collectionName}:*`);
    const items = await Promise.all(keys.map((key) => this.findById(key.split(":")[1])));

    return items.filter(Boolean) as T[];
  }

  protected async findAllBy(props: Partial<T & any>): Promise<T[]> {
    const keys = Object.keys(props);
    let foundKeys = await this.findKeys(props);

    if (foundKeys.length < keys.length) {
      return [];
    }

    const getId = (key: string) => key.split(":")[2];

    const map = foundKeys.reduce((map: Map<string, number>, key) => {
      const id = getId(key);
      const value = map.get(id) || 0;

      return map.set(id, value + 1);
    }, new Map());

    const promises = [...map.entries()].filter(([, num]) => num === keys.length).map(([id]) => this.findById(id));

    const result = await Promise.all(promises);

    return result.filter(Boolean) as T[];
  }
}
