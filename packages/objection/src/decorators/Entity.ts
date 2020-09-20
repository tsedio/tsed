import {nameOf} from "@tsed/core";
import {getJsonSchema} from "@tsed/common";

export function Entity (tableName: string): ClassDecorator {
  return (target) => {
    Object.defineProperty(target, 'tableName', {
      get(){
        return tableName || (nameOf(target) + 's')
      }
    })

    Object.defineProperty(target, 'jsonSchema', {
      get(){
        return getJsonSchema(target as any)
      }
    })
  }
}