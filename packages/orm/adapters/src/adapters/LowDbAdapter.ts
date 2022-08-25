import {cleanObject} from "@tsed/core";
import isMatch from "lodash/isMatch";
import low from "lowdb";
import {v4 as uuid} from "uuid";
import {deserialize} from "v8";
import {Adapter} from "../domain/Adapter";

export interface AdapterModel {
  _id: string;
  expires_at?: Date;

  [key: string]: any;
}

export class LowDbAdapter<T extends AdapterModel> extends Adapter<T> {
  protected db: low.LowdbSync<{collection: T[]}>;

  get collection() {
    return this.db.get("collection");
  }

  protected get dbFilePath() {
    const lowdbDir = this.configuration.get("adapters.lowdbDir", ".db");
    return `${lowdbDir}/${this.collectionName}.json`;
  }

  public async create(payload: Partial<T>, expiresAt?: Date): Promise<T> {
    if (expiresAt) {
      payload.expires_at = expiresAt;
    }

    payload._id = uuid();

    await this.validate(payload as T);

    await this.collection.push(this.serialize(payload) as T).write();

    return this.deserialize(payload);
  }

  public async upsert(id: string, payload: T, expiresAt?: Date): Promise<T> {
    let item = await this.findById(id);

    if (!item) {
      payload = {...payload, _id: id || uuid(), expires_at: expiresAt};

      await this.validate(payload as T);
      await this.collection.push(this.serialize(payload) as T).write();

      return this.deserialize(payload);
    }

    return (await this.update(id, payload, expiresAt)) as T;
  }

  public async update(id: string, payload: T, expiresAt?: Date): Promise<T | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<T & any>, payload: T, expiresAt?: Date): Promise<T | undefined> {
    let index = this.collection.findIndex(cleanObject(predicate)).value();

    if (index === -1) {
      return;
    }

    let item = this.deserialize(this.collection.get(index).value());

    item = {
      expires_at: expiresAt || item.expires_at,
      ...item,
      ...payload,
      _id: item._id
    };

    await this.validate(item as T);
    await this.collection.set(index, item).write();

    return this.deserialize(item);
  }

  async findOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = this.collection.find(cleanObject(predicate)).value();

    return this.deserialize(item);
  }

  async findById(_id: string): Promise<T | undefined> {
    return this.findOne({_id});
  }

  public async findAll(predicate: Partial<T & any> = {}): Promise<T[]> {
    return this.collection
      .filter(cleanObject(predicate))
      .value()
      .map((item) => this.deserialize(item));
  }

  public async deleteOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = this.collection.find(cleanObject(predicate)).value();

    if (item) {
      this.collection.remove(({_id}) => _id === item._id).write();

      return this.deserialize(item);
    }
  }

  public async deleteById(_id: string): Promise<T | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<T>): Promise<T[]> {
    let removedItems: T[] = [];

    await this.collection
      .remove((item) => {
        if (isMatch(item, cleanObject(predicate))) {
          removedItems.push(this.deserialize(item));
          return true;
        }
        return false;
      })
      .write();

    return removedItems;
  }
}
