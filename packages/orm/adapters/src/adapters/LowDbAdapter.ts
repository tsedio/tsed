import isMatch from "lodash/isMatch";
import {Low, LowSync} from "lowdb";
import {v4 as uuid} from "uuid";
import {Adapter} from "../domain/Adapter";
import _ from "lodash";

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
  protected db: LowSync<LowModel<T>>| Low<LowModel<T>> ;

  get collection() {
    // return this.db.get("collection");
    return this.db.data?.collection!;
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

    this.collection.push(payload as T);
    this.db.write();

    return this.deserialize(payload);
  }

  public async upsert(id: string, payload: T, expiresAt?: Date): Promise<T> {
    let item = await this.findById(id);

    if (!item) {
      payload = {...payload, _id: id || uuid(), expires_at: expiresAt};

      await this.validate(payload as T);
      this.collection.push(payload as T);
      this.db.write();

      return this.deserialize(payload);
    }

    return (await this.update(id, payload, expiresAt)) as T;
  }

  public async update(id: string, payload: T, expiresAt?: Date): Promise<T | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<T & any>, payload: T, expiresAt?: Date): Promise<T | undefined> {
    let index = _.findIndex(this.collection, predicate);

    if (index === -1) {
      return;
    }

    let item = this.collection[index];

    item = {
      _id: item._id,
      expires_at: expiresAt || item.expires_at,
      ...this.updateInstance(item, payload)
    };

    await this.validate(item as T);
    this.collection[index] = item;
    this.db.write();

    return this.deserialize(item);
  }

  async findOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = _.find(this.collection, predicate);

    return this.deserialize(item);
  }

  async findById(_id: string): Promise<T | undefined> {
    return this.findOne({_id});
  }

  public async findAll(predicate: Partial<T & any> = {}): Promise<T[]> {
    return _.filter(this.collection, predicate).map((item) => this.deserialize(item));
  }

  public async deleteOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = _.find<T>(this.collection, predicate);

    if (item) {
      _.remove(this.collection, ({_id}) => _id === item._id);

      return this.deserialize(item);
    }
  }

  public async deleteById(_id: string): Promise<T | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<T>): Promise<T[]> {
    let removedItems: T[] = [];

    _.remove(this.collection, (item) => {
      if (isMatch(item, predicate)) {
        removedItems.push(this.deserialize(item));
        return true;
      }
      return false;
    });
    this.db.write();

    return removedItems;
  }
}
