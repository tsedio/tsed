import {AjvService} from "@tsed/ajv";
import {isArray, isObject, nameOf, Type} from "@tsed/core";
import {Configuration, Inject, Opts} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
import {getPropertiesStores} from "@tsed/schema";

export interface AdapterConstructorOptions<T = any> {
  model: Type<T> | Object;
  collectionName?: string;
  indexes?: {
    [propertyKey: string]: Record<string, any>;
  };
}

function getIndexes(model: any) {
  return [...getPropertiesStores(model).entries()]
    .filter(([, entity]) => entity.store.has("adapter:indexed"))
    .map(([propertyKey, entity]) => {
      return {
        propertyKey: String(propertyKey),
        options: entity.store.get("adapter:indexed")
      };
    });
}

function mapIndexes(indexes: {[p: string]: Record<string, any>} | {propertyKey: string; options: any}[]) {
  return Object.entries(indexes).reduce((indexes: any[], [propertyKey, options]) => {
    return indexes.concat({
      propertyKey,
      options
    });
  }, []);
}

function pluralize(name: string) {
  return name.slice(-1) === "y" ? `${name.slice(0, name.length - 1)}ies` : name + "s";
}

export abstract class Adapter<Model = any> {
  readonly model: Type<Model> | Object;
  readonly collectionName: string;
  readonly indexes: {propertyKey: string; options: any}[];

  @Inject()
  private ajvService: AjvService;

  constructor(@Opts options: AdapterConstructorOptions, @Configuration() protected configuration: Configuration) {
    this.model = options.model;
    this.collectionName = options.collectionName || pluralize(nameOf(options.model));

    let indexes = options.indexes || configuration.get(`adapters.${this.collectionName}.indexes`) || getIndexes(this.model);

    if (!isArray(indexes)) {
      indexes = mapIndexes(indexes);
    }

    this.indexes = indexes;
  }

  async validate(value: Model): Promise<void> {
    if (this.getModel()) {
      await this.ajvService.validate(this.serialize(value), {
        type: this.model
      });
    }
  }

  abstract create(value: Partial<Omit<Model, "_id">>, expiresAt?: Date): Promise<Model>;

  abstract update(id: string, value: Model, expiresAt?: Date): Promise<Model | undefined>;

  abstract updateOne(predicate: Partial<Model>, value: Partial<Model>, expiresAt?: Date): Promise<Model | undefined>;

  abstract upsert(id: string, value: Model, expiresAt?: Date): Promise<Model>;

  abstract findOne(predicate: Partial<Model>): Promise<Model | undefined>;

  abstract findById(id: string): Promise<Model | undefined>;

  abstract findAll(predicate?: Partial<Model>): Promise<Model[]>;

  abstract deleteOne(predicate: Partial<Model>): Promise<Model | undefined>;

  abstract deleteMany(predicate: Partial<Model>): Promise<Model[]>;

  abstract deleteById(id: string): Promise<Model | undefined>;

  getModel() {
    return (this.model as unknown) !== Object ? this.model : undefined;
  }

  protected updateInstance(src: any, payload: any) {
    const item = Object.assign({
      ...this.serialize(src),
      ...this.serialize(payload)
    });

    item.expires_at = item.expires_at ? new Date(item.expires_at) : item.expires_at;

    return item;
  }

  protected deserialize(obj: any) {
    return deserialize(obj, {
      type: this.getModel(),
      useAlias: false
    });
  }

  protected serialize(obj: any) {
    return serialize(obj, {
      useAlias: false
    });
  }
}
