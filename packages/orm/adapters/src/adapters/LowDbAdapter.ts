import {cleanObject} from "@tsed/core";
import isMatch from "lodash/isMatch";
import low from "lowdb";
import {v4 as uuid} from "uuid";
import {Adapter} from "../domain/Adapter";
import {RevisionAdapterModel, RevisionFieldsModel} from "../domain/RevisionAdapterModel";

export interface AdapterModel extends Partial<RevisionFieldsModel> {
  _id: string;
  expires_at?: Date;

  [key: string]: any;
}

export class LowDbAdapter<Model extends AdapterModel> extends Adapter<Model> {
  protected db: low.LowdbSync<{collection: Model[]}>;

  get collection() {
    return this.db.get("collection");
  }

  protected get dbFilePath() {
    const lowdbDir = this.configuration.get("adapters.lowdbDir", ".db");
    return `${lowdbDir}/${this.collectionName}.json`;
  }

  public async create(payload: Partial<Model>, expiresAt?: Date): Promise<Model> {
    if (expiresAt) {
      payload.expires_at = expiresAt;
    }

    payload._id = uuid();

    await this.validate(payload as Model);

    await this.collection.push(this.serialize(payload) as Model).write();

    return this.deserialize(payload);
  }

  public async upsert(id: string, payload: Model, expiresAt?: Date): Promise<Model> {
    let item = await this.findById(id);

    if (!item) {
      payload = {...payload, _id: id || uuid()};

      await this.validate(payload as Model);

      const item = this.serialize(payload);
      item.expires_at = expiresAt;

      await this.collection.push(item).write();

      return this.deserialize(payload);
    }

    return (await this.update(id, payload, expiresAt)) as Model;
  }

  public async update(id: string, payload: Model, expiresAt?: Date): Promise<Model | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt);
  }

  public async updateOne(predicate: Partial<Model & any>, payload: Model, expiresAt?: Date): Promise<Model | undefined> {
    let index = this.collection.findIndex(cleanObject(predicate)).value();

    if (index === -1) {
      return;
    }

    let item = this.deserialize(this.collection.get(index).value());

    if (item instanceof RevisionAdapterModel) {
      payload.created = item.created;
      payload.modified = Date.now();
    }

    item = {
      ...item,
      ...cleanObject(payload),
      _id: item._id
    };

    await this.validate(item as Model);

    item.expires_at = expiresAt || item.expires_at;

    await this.collection.set(index, item).write();

    return this.deserialize(item);
  }

  async findOne(predicate: Partial<Model & any>): Promise<Model | undefined> {
    const item = this.collection.find(cleanObject(predicate)).value();

    return this.deserialize(item);
  }

  async findById(_id: string): Promise<Model | undefined> {
    return this.findOne({_id});
  }

  public async findAll(predicate: Partial<Model & any> = {}): Promise<Model[]> {
    return this.collection
      .filter(cleanObject(predicate))
      .value()
      .map((item) => this.deserialize(item));
  }

  public async deleteOne(predicate: Partial<Model & any>): Promise<Model | undefined> {
    const item = this.collection.find(cleanObject(predicate)).value();

    if (item) {
      this.collection.remove(({_id}) => _id === item._id).write();

      return this.deserialize(item);
    }
  }

  public async deleteById(_id: string): Promise<Model | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<Model>): Promise<Model[]> {
    let removedItems: Model[] = [];

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
