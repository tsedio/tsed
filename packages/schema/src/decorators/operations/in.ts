import {DecoratorTypes, MetadataTypes, Type, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityStore, JsonParameter, JsonSchema} from "../../domain";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes";

export interface InChainedDecorators {
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

  (target: Object, propertyKey: string | symbol, parameterIndex: number): void;

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
  const types: MetadataTypes = {};

  const decorator = (target: any, propertyKey: string | symbol, index: PropertyDescriptor | number) => {
    const store = JsonEntityStore.from(target, propertyKey, index);

    switch (store.decoratorType) {
      case DecoratorTypes.PARAM:
        store.parameter!.in(inType);
        break;
      case DecoratorTypes.METHOD:
        jsonParameter.in(inType);
        store.operation!.addParameter(-1, jsonParameter);

        jsonParameter.schema(JsonSchema.from({type: types.type}));
        break;
      default:
        throw new UnsupportedDecoratorType(In, [target, propertyKey, index]);
    }
  };

  decorator.Type = (type: Type<any>) => {
    types.type = type;

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

  return decorator;
}
