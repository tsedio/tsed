import {cleanObject} from "@tsed/core";
import _ from "lodash";
import isMatch from "lodash/isMatch.js";
import type {Low, LowSync} from "lowdb";
import {v4 as uuid} from "uuid";

import {Adapter} from "../domain/Adapter.js";

export interface AdapterModel {
  _id: string;
  expires_at?: Date;

  [key: string]: any;
}

export interface LowModel<T> {
  collection: T[];
  collectionName?: string;
  modelName?: string;
}

export class LowDbAdapter<T extends AdapterModel> extends Adapter<T> {
  protected db: LowSync<LowModel<T>> | Low<LowModel<T>>;

  get collection() {
    return this.db.data!.collection!;
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

    await this.db.update(({collection}) => collection.push(this.serialize(payload)));

    return this.deserialize(payload);
  }

  public async upsert(id: string, payload: T, expiresAt?: Date): Promise<T> {
    let item = await this.findById(id);

    if (!item) {
      payload._id = id || uuid();

      await this.validate(payload as T);

      const item = this.serialize(payload);
      item.expires_at = expiresAt;

      await this.db.update(({collection}) => collection.push(item));

      return this.deserialize(item);
    }

    return (await this.update(id, payload, expiresAt)) as T;
  }

  update(id: string, payload: T, expiresAt?: Date): Promise<T | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<T & any>, payload: T, expiresAt?: Date): Promise<T | undefined> {
    let index = _.findIndex(this.collection, cleanObject(predicate));

    if (index === -1) {
      return;
    }

    let item = this.deserialize(this.collection[index]);

    Object.assign(item, payload, {_id: item._id});

    await this.validate(item as T);

    item.expires_at = expiresAt || item.expires_at;
    this.db.update(({collection}) => (collection[index] = item));

    return this.deserialize(item);
  }

  findOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = _.find(this.collection, cleanObject(predicate));

    return this.deserialize(item);
  }

  findById(_id: string): Promise<T | undefined> {
    return this.findOne({_id});
  }

  public async findAll(predicate: Partial<T & any> = {}): Promise<T[]> {
    return _.filter(this.collection, cleanObject(predicate)).map((item) => this.deserialize(item));
  }

  public deleteOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = _.find<T>(this.collection, cleanObject(predicate));

    if (item) {
      _.remove(this.collection, ({_id}) => _id === item._id);

      return Promise.resolve(this.deserialize(item));
    }

    return Promise.resolve(undefined);
  }

  public deleteById(_id: string): Promise<T | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<T>): Promise<T[]> {
    let removedItems: T[] = [];

    this.db.update((data) => {
      _.remove(data.collection, (item) => {
        if (isMatch(item, cleanObject(predicate))) {
          removedItems.push(this.deserialize(item));
          return true;
        }
        return false;
      });
    });

    return removedItems;
  }
}
