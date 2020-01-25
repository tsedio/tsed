import {deepClone, Type} from "@tsed/core";

export interface MemoryCollectionID {
  _id: string;
}

function match(obj, predicate) {
  for (const [k, v] of Object.entries(predicate)) {
    if (v !== undefined && obj[k] !== v) {
      return false;
    }
  }

  return true;
}

function createInstance(model: any, obj: any = {}) {
  return Object.assign(new model(), deepClone(obj));
}

export class MemoryCollection<T extends MemoryCollectionID> {
  protected collection: T[] = [];

  constructor(protected model: Type<T>, resources: any[] = []) {
    resources.forEach((item) => this.create(item));
  }

  public create(value: Partial<T>) {
    value._id = require("node-uuid").v4();

    const {model, collection} = this;
    const instance = createInstance(model, value);

    collection.push(instance);

    return instance;
  }

  public update(value: Partial<T>): T | undefined {
    const index = this.collection.findIndex((obj) => {
      return obj._id === value._id;
    });

    if (index === -1) {
      return;
    }

    this.collection[index] = Object.assign(
      createInstance(this.model, this.collection[index]),
      value
    );

    return this.collection[index];
  }

  public findOne(predicate: Partial<T>): T | undefined {
    const item = this.collection.find((obj) => match(obj, predicate));

    return item ? createInstance(this.model, item) : undefined;
  }

  public findAll(predicate: Partial<T> = {}): T[] {
    return this
      .collection
      .filter((obj) => match(obj, predicate))
      .map((obj) => createInstance(this.model, obj));
  }

  public removeOne(predicate: Partial<T>): T | undefined {
    let removedItem: T | undefined;

    this.collection = this.collection
      .filter((obj) => {
        if (match(obj, predicate) && !removedItem) {
          removedItem = obj;
          return false;
        }

        return true;
      });

    return removedItem;
  }

  public removeAll(predicate: Partial<T>): T[] {
    let removedItems: T[] = [];
    this.collection = this.collection.filter((obj) => {
      if (match(obj, predicate)) {
        removedItems.push(obj);
        return false;
      }

      return true;
    });

    return removedItems;
  }
}

