import {AjvService} from "@tsed/ajv";
import {nameOf, Type} from "@tsed/core";
import {Configuration, Inject, Opts} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";

export abstract class Adapter<T = any> {
  protected model: Type<T> | Object;
  protected collectionName: string;

  @Inject()
  private ajvService: AjvService;

  constructor(@Opts options: any, @Configuration() protected configuration: Configuration) {
    this.model = options.model;
    this.collectionName = options.collectionName || nameOf(options.model);
  }

  async validate(value: T): Promise<void> {
    if (this.getModel()) {
      await this.ajvService.validate(value, {
        type: this.model
      });
    }
  }

  abstract create(value: Partial<Omit<T, "_id">>, expiresAt?: Date): Promise<T>;

  abstract update(id: string, value: T, expiresAt?: Date): Promise<T | undefined>;

  abstract updateOne(predicate: Partial<T>, value: Partial<T>, expiresAt?: Date): Promise<T | undefined>;

  abstract upsert(id: string, value: T, expiresAt?: Date): Promise<T>;

  abstract findOne(predicate: Partial<T>): Promise<T | undefined>;

  abstract findById(id: string): Promise<T | undefined>;

  abstract findAll(predicate?: Partial<T>): Promise<T[]>;

  abstract deleteOne(predicate: Partial<T>): Promise<T | undefined>;

  abstract deleteMany(predicate: Partial<T>): Promise<T[]>;

  abstract deleteById(id: string): Promise<T | undefined>;

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
