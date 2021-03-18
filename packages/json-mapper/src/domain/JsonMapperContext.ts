import {isCollection, Type} from "@tsed/core";
import {JsonMapperCtx} from "../interfaces/JsonMapperMethods";
/**
 * @ignore
 */
export interface JsonMapperContextProps extends Partial<Omit<JsonMapperCtx, "next">> {
  next: (data: any, options: any) => void;
  options: any;
}
/**
 * @ignore
 */
export class JsonMapperContext implements JsonMapperCtx {
  readonly collectionType: Type<any> | undefined;
  readonly type: Type<any> | any;
  readonly options: any;
  private _next: (data: any, options: any) => void;

  constructor({type, collectionType, next, options}: JsonMapperContextProps) {
    this.type = type;
    this.collectionType = isCollection(collectionType) ? collectionType : undefined;
    this._next = next;
    this.options = options;
  }

  next(data: any) {
    return this._next(data, {
      ...this.options,
      type: this.type
    });
  }
}
