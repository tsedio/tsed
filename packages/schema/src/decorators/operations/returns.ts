import {
  decorateMethodsOf,
  decoratorTypeOf,
  DecoratorTypes,
  isCollection,
  isPlainObject,
  isPrimitiveOrPrimitiveClass,
  isString,
  Type,
  UnsupportedDecoratorType
} from "@tsed/core";
import {HTTP_STATUS_MESSAGES} from "../../constants/httpStatusMessages";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonResponse} from "../../domain/JsonResponse";
import {JsonSchema, JsonSchemaObject} from "../../domain/JsonSchema";
import {JsonHeader, JsonHeaders} from "../../interfaces/JsonOpenSpec";
import {getStatusModel} from "../../utils/defineStatusModel";
import {isSuccessStatus} from "../../utils/isSuccessStatus";
import {mapHeaders} from "../../utils/mapHeaders";

export interface ReturnsChainedDecorators {
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

  (target: Function): void;

  /**
   * Set a Content-Type for the current response
   * @param value
   * @constructor
   */
  ContentType(value: string): this;

  /**
   * Add a description
   * @param description
   */
  Description(description: string): this;

  /**
   * Add examples
   * @param examples
   */
  Examples(examples: any): this;

  /**
   * Change the model type
   * @param type
   */
  Type(type: Type<any> | any): this;

  /**
   * Change the status
   * @param status
   * @constructor
   */
  Status(status: string | number): this;

  /**
   * Add the nested types
   * @param types
   */
  Of(...types: (Type<any> | any)[]): this;

  /**
   * Declare a nested generic models
   * @param generics
   */
  Nested(...generics: (Type<any> | any)[]): this;

  /**
   * Add header.
   * @param key
   * @param value
   */
  Header(key: string, value: number | string | (JsonHeader & {value?: string | number})): this;

  /**
   * Add headers
   */
  Headers(headers: JsonHeaders): this;

  /**
   * Assign partial schema
   * @param schema
   */
  Schema(schema: Partial<JsonSchemaObject>): this;

  /**
   * Add an inline title for the return model.
   * @param title
   */
  Title(title: string): this;

  [key: string]: any;
}

interface ReturnsActionContext {
  store: JsonEntityStore;
  status?: string | number;
  contentType: string;
  response: JsonResponse;
  model: Type<any> | any;
  decoratorContext: DecoratorTypes;
  currentSchema?: JsonSchema;
}

interface ReturnsActionHandler {
  (ctx: ReturnsActionContext): void;
}

/**
 * @ignore
 */
function getContentType({contentType, model}: ReturnsActionContext) {
  if (model && !isPlainObject(model) && !isPrimitiveOrPrimitiveClass(model)) {
    contentType = contentType || "application/json";
  }

  return contentType;
}

/**
 * @ignore
 */
function getStatus({status}: ReturnsActionContext) {
  return status || "default";
}

/**
 * @ignore
 */
function initSchemaAction(ctx: ReturnsActionContext) {
  const {model, response, store, decoratorContext} = ctx;
  const operation = store.operation!;
  const currentStatus = getStatus(ctx);

  if (decoratorContext === DecoratorTypes.CLASS) {
    const current = operation.getResponseOf(currentStatus);

    current.get("description") && response.description(current.get("description"));
    current.get("headers") &&
      response.headers({
        ...(response.get("headers") || {}),
        ...current.get("headers")
      });
  }

  const contentType = getContentType(ctx);
  const currentResponse = operation.addResponse(currentStatus, response).getResponseOf(currentStatus);
  const media = currentResponse.getMedia(contentType || "*/*");
  const schema = media.get("schema") || new JsonSchema({type: model});

  model && schema.type(model);

  ctx.currentSchema = schema;

  media.schema(schema);

  if (isSuccessStatus(ctx.status) || currentStatus === "default") {
    if (model) {
      store.type = model;
    }
  }

  // additional info for OS2
  contentType && operation.addProduce(contentType);
}

/**
 * @ignore
 */
function checkPrimitive(model: any) {
  if (isPrimitiveOrPrimitiveClass(model)) {
    throw new Error("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
  }
}

/**
 * @ignore
 */
function checkCollection(model: any) {
  if (isCollection(model)) {
    throw new Error("Returns.Nested cannot be used with the following classes: Map, Set, Array, String, Number, Boolean");
  }
}

/**
 * @ignore
 */
function mapLegacy(decorator: any, model: object): ReturnsChainedDecorators {
  const {collectionType, type, headers, description, examples, schema} = model as any;
  if (collectionType || type) {
    decorator.Type(collectionType || type);
  }

  if (collectionType) {
    decorator = decorator.Of(type);
  }

  if (headers) {
    decorator = decorator.Headers(headers);
  }

  if (description) {
    decorator = decorator.Description(description);
  }

  if (examples) {
    decorator = decorator.Examples(examples);
  }

  if (schema) {
    decorator = decorator.Schema(schema as any);
  }

  return decorator;
}

/**
 * Add responses documentation for a specific status code.
 *
 * ## Usage
 *
 * Ts.ED v5/v6 API introducing the chaining decorator concept. Now a decorator like Returns can be used with another decorators like Description.
 *
 * ::: warning
 * v5 has a basic support of the chaining decorator to facilitate the migration to v6!
 * :::
 *
 * ```typescript
 * import {Returns} from "@tsed/schema";
 *
 * @Controller("/")
 * class MyController {
 *   @Returns(404, String).Description("Not Found")
 *   @Returns(200, Model).Description("Success")
 *   async myMethod(): Promise<Model> {}
 * }
 * ```
 *
 * ::: tip
 * TypeScript and your IDE will discover automatically the chained decorators. But for more details you can look on @@ReturnsChainedDecorators@@ interface, to know
 * what chained decorators are available under Returns decorator.
 * :::
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description",
 *       "schema": {"type": "string"}
 *     },
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"$ref": "..."}
 *     }
 *   }
 * }
 * ```
 *
 * ## Declaring an Array
 *
 * Use chained decorators to declare an array with model as following:
 *
 * ```typescript
 * import {Returns} from "@tsed/schema";
 *
 * @Controller("/models")
 * class ModelCtrl {
 *   @Get("/")
 *   @Returns(200, Array).Of(Model).Description("Success")
 *   async myMethod(): Promise<Model>  {
 *   }
 * }
 * ```
 *
 * Deprecated version:
 *
 * ```typescript
 * import {ReturnsArray} from "@tsed/common";
 * import {Returns} from "@tsed/schema";
 *
 * @Controller("/")
 * class MyController {
 *   @ReturnsArray(200, Model) // deprecated
 *   async myMethod(): Promise<Model> {}
 * }
 * ```
 *
 * ### Declaring a generic model <Badge text="6+"/>
 *
 * Sometime, it might be useful to use generic models. TypeScript doesn't store the generic type in the metadata. This is why we need to
 * declare explicitly the generic models with the decorators.
 *
 * One of the generic's usage, can be a paginated list. With Returns decorator it's now possible to declare generic type and generate the appropriate OpenSpec documentation.
 *
 * Starting with the pagination model, by using @@Generics@@ and @@CollectionOf@@:
 *
 * ```typescript
 * @Generics("T")
 * class Pagination<T> {
 *  @CollectionOf("T")
 *  data: T[];
 *
 *  @Property()
 *  totalCount: number;
 * }
 * ```
 *
 * Now, we need a model to be used with the generic Pagination model:
 *
 * ```typescript
 * class Product {
 *  @Property()
 *  id: string;
 *
 *  @Property()
 *  title: string;
 * }
 * ```
 *
 * Finally, we can use our models on a method as following:
 *
 * ```typescript
 * class Controller {
 *   @OperationPath("POST", "/")
 *   @Returns(200, Pagination).Of(Product).Description("description")
 *   async method(): Promise<Pagination<Product> | null> {
 *     return null;
 *   }
 * }
 * ```
 *
 * ### Declaring a nested generics models <Badge text="6+"/>
 *
 * It's also possible to declare a nested generics models in order to have this type `Pagination<Submission<Product>>`:
 *
 * ```typescript
 * import {Generics, Property, Returns} from "@tsed/schema";
 * import {Post} from "@tsed/common";
 *
 * class Controller {
 *   @Post("/")
 *   @Returns(200, Pagination).Of(Submission).Nested(Product).Description("description")
 *   async method(): Promise<Pagination<Submission<Product>> | null> {
 *     return null;
 *   }
 * }
 * ```
 *
 * And here is the Submission model:
 *
 * ```typescript
 * import {Generics, Property} from "@tsed/schema";
 *
 * @Generics("T")
 * class Submission<T> {
 *   @Property()
 *   _id: string;
 *   @Property("T")
 *   data: T;
 * }
 * ```
 *
 * @param status
 * @param model
 * @decorator
 * @swagger
 * @schema
 * @response
 * @operation
 */
export function Returns(status?: string | number, model?: Type<any>): ReturnsChainedDecorators;
/**
 * @deprecated Since 2020. Use chained decorator version instead.
 */
export function Returns(status?: string | number, model?: object): ReturnsChainedDecorators;
export function Returns(status?: string | number, model?: Type<any> | any): ReturnsChainedDecorators {
  const response = new JsonResponse();
  let decoratorContext: DecoratorTypes;
  let contentType: string;

  if (model && isPlainObject(model)) {
    // istanbul ignore
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      console.warn("Use @Returns/@Status with an object to describe schema is deprecated.");
      console.warn("Use the following example: @Returns(200, Type).Description('description')");
      console.warn('import {Returns} from "@tsed/schema"');
      console.warn("@Returns(200, Type).Description('description')");
    }

    const {code = "default"} = model as any;

    let decorator = Returns(code);

    return mapLegacy(decorator, model);
  }

  if (status && HTTP_STATUS_MESSAGES[status]) {
    response.description(HTTP_STATUS_MESSAGES[status]);

    if (!model) {
      model = getStatusModel(+status);
    }
  }

  const actions: ReturnsActionHandler[] = [initSchemaAction];

  const decorator = (...args: any[]) => {
    const type = decoratorTypeOf(args);

    switch (type) {
      case DecoratorTypes.METHOD:
        const store = JsonEntityStore.from(...args);

        if (store.operation) {
          const ctx: ReturnsActionContext = {status, contentType, response, model, store, decoratorContext};

          actions.forEach((action: any) => {
            action(ctx);
          });
        }
        break;
      case DecoratorTypes.CLASS:
        decoratorContext = DecoratorTypes.CLASS;
        decorateMethodsOf(args[0], decorator);
        break;
      default:
        throw new UnsupportedDecoratorType(Returns, args);
    }
  };

  decorator.Headers = (headers: JsonHeaders) => {
    response.headers({
      ...(response.get("headers") || {}),
      ...mapHeaders(headers)
    });

    return decorator;
  };

  decorator.Header = (key: string, value: string | JsonHeader) => {
    decorator.Headers({
      [key]: value
    });

    return decorator;
  };

  decorator.ContentType = (value: string) => {
    contentType = value;

    return decorator;
  };

  decorator.Description = (description: string) => {
    response.description(description);

    return decorator;
  };

  decorator.Examples = (examples: any) => {
    response.set("examples", isString(examples) ? [examples] : examples);

    return decorator;
  };

  decorator.Type = (type: Type<any> | any) => {
    model = type;

    return decorator;
  };

  decorator.Of = (...types: (Type<any> | any)[]) => {
    checkPrimitive(model);

    actions.push((ctx) => {
      const {currentSchema} = ctx;

      if (isCollection(model)) {
        currentSchema?.itemSchema({type: types[0]});
      } else {
        currentSchema?.nestedGenerics.push(types);
      }
    });

    return decorator;
  };

  decorator.Nested = (...generics: (Type<any> | any)[]) => {
    checkPrimitive(model);
    checkCollection(model);

    actions.push((ctx) => {
      const {currentSchema} = ctx;
      currentSchema!.nestedGenerics.push(generics);
    });

    return decorator;
  };

  decorator.Schema = (schema: Partial<JsonSchemaObject>) => {
    actions.push((ctx) => {
      const {currentSchema} = ctx;

      currentSchema!.assign(schema);
    });

    return decorator;
  };

  decorator.Title = (title: string) => {
    return decorator.Schema({title});
  };

  decorator.Status = (code: string | number) => {
    status = code;

    return decorator;
  };

  return decorator;
}
