import {decorateMethodsOf, DecoratorTypes, Type, UnsupportedDecoratorType} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonMethodStore} from "../../domain/JsonMethodStore.js";
import {JsonParameter} from "../../domain/JsonParameter.js";
import {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes.js";
import {JsonSchema, JsonSchemaObject} from "../../domain/JsonSchema.js";

export interface InChainedDecorators {
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

  (target: Object, propertyKey: string | symbol, parameterIndex: number): void;

  (target: Function): void;

  /**
   * Type of this in parameter
   * @param type
   */
  Type(type: Type<any>): this;

  /**
   *
   * @param name
   */
  Name(name: string): this;

  /**
   *
   * @param description
   */
  Description(description: string): this;

  /**
   *
   * @param required
   */
  Required(required?: boolean): this;

  /**
   * Add pattern constraint. Only available for OPENAPI.
   * @param pattern
   */
  Pattern(pattern: string | RegExp): this;

  /**
   * Add custom schema.
   * @param schema
   */
  Schema(schema: Partial<JsonSchemaObject | JsonSchema>): this;
}

/**
 * Add a input parameter.
 *
 * ::: warning
 * Don't use decorator with Ts.ED application to decorate parameters. Use @@BodyParams@@, @@PathParams@@, etc... instead.
 * But you can use this decorator on Method, to add extra in parameters like Authorization header.
 *
 * ```typescript
 * @Controller("/")
 * class MyController {
 *    @Get("/")
 *    @In("header").Type(String).Name("Authorization").Required()
 *    method() {
 *    }
 *  }
 * ```
 * :::
 *
 * @param inType
 * @decorator
 * @swagger
 * @schema
 * @input
 * @operation
 */
export function In(inType: JsonParameterTypes | string): InChainedDecorators {
  const jsonParameter = new JsonParameter();
  const schema: any = {};

  const decorator = (target: any, propertyKey?: string | symbol, index?: PropertyDescriptor | number) => {
    const store = JsonEntityStore.from(target, propertyKey, index);

    switch (store.decoratorType) {
      case DecoratorTypes.PARAM:
        (store as JsonParameterStore).parameter.in(inType);
        break;
      case DecoratorTypes.METHOD:
        jsonParameter.in(inType);
        (store as JsonMethodStore).operation.addParameter(-1, jsonParameter);

        jsonParameter.schema(JsonSchema.from(schema));
        break;

      case DecoratorTypes.CLASS:
        decorateMethodsOf(target, decorator);
        break;

      default:
        throw new UnsupportedDecoratorType(In, [target, propertyKey, index]);
    }
  };

  decorator.Type = (type: Type<any>) => {
    schema.type = type;

    return decorator;
  };

  decorator.Name = (name: string) => {
    jsonParameter.name(name);

    return decorator;
  };

  decorator.Description = (description: string) => {
    jsonParameter.description(description);

    return decorator;
  };

  decorator.Required = (required: boolean = true) => {
    jsonParameter.required(required);

    return decorator;
  };

  decorator.Pattern = (pattern: string | RegExp) => {
    return decorator.Schema({pattern: pattern.toString()});
  };

  decorator.Schema = (_schema: any) => {
    Object.assign(schema, _schema.toJSON ? _schema.toJSON() : _schema);

    return decorator;
  };

  return decorator;
}
