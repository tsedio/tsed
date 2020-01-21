import {Type} from "@tsed/core";

export interface MemoryCollectionID {
  _id: string;
}

export class MemoryCollection<T extends MemoryCollectionID> {
  protected collection: T[] = [];

  constructor(protected model: Type<T>) {
  }

  public async create(value: Partial<T>) {
    value._id = require("node-uuid").v4();

    const {model, collection} = this;
    const instance = new model();
    Object.assign(instance, value);

    collection.push(instance);

    return instance;
  }

  public async update(value: Partial<T>): Promise<T | undefined> {
    const index = this.collection.findIndex((obj) => {
      return obj._id === value._id;
    });

    if (index === -1) {
      return;
    }

    Object.assign(this.collection[index], value);

    return this.collection[index];
  }

  public async findOne(predicate: Partial<T>): Promise<T | undefined> {
    return this.collection
      .find((obj) => {
        for (const [k, v] of Object.entries(predicate)) {
          if (obj[k] !== v) {
            return false;
          }
        }

        return true;
      });
  }

  public async findAll(predicate: Partial<T> = {}): Promise<T[] | undefined> {
    return this
      .collection
      .filter((obj) => {
        for (const [k, v] of Object.entries(predicate)) {
          if (v !== undefined && obj[k] !== v) {
            return false;
          }
        }

        return true;
      });
  }

  public removeOne(predicate: Partial<T>): T | undefined {
    let removedItem: T | undefined;
    this.collection = this.collection.filter((obj) => {
      for (const [k, v] of Object.entries(predicate)) {
        if (obj[k] !== v && !removedItem) {
          removedItem = obj;
          return false;
        }
      }

      return true;
    });

    return removedItem;
  }

  public removeAll(predicate: Partial<T>): T[] {
    let removedItems: T[] = [];
    this.collection = this.collection.filter((obj) => {
      for (const [k, v] of Object.entries(predicate)) {
        if (obj[k] !== v) {
          removedItems.push(obj);
          return false;
        }
      }

      return true;
    });

    return removedItems;
  }
}

//
// @Service()
// export class MemoryStorage {
//   private collections: Map<string, MemoryCollection<any>> = new Map<string, MemoryCollection<any>>();
//
//
//   /**
//    * Return the value stored.
//    * @param collectionName
//    */
//   protected get<T>(collectionName: string): MemoryCollection<T> {
//     return this.collections.get(collectionName);
//   }
//
//   /**
//    * Serialize value and store it.
//    * @param collectionName
//    * @param value
//    */
//   protected set<T>(collectionName: string, value: any, model: Type<any>) {
//     return this.states.set(collectionName, JSON.stringify(value));
//   }
// }
