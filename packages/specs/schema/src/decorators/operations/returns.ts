import {
  decorateMethodsOf,
  decoratorTypeOf,
  DecoratorTypes,
  isCollection,
  isObject,
  isPlainObject,
  isPrimitiveOrPrimitiveClass,
  isString,
  Type,
  UnsupportedDecoratorType
} from "@tsed/core";
import {OS3Example} from "@tsed/openspec";
import {HTTP_STATUS_MESSAGES} from "../../constants/httpStatusMessages";
import {DecoratorContext} from "../../domain/DecoratorContext";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonResponse} from "../../domain/JsonResponse";
import {JsonSchema, JsonSchemaObject} from "../../domain/JsonSchema";
import {JsonHeader, JsonHeaders} from "../../interfaces/JsonOpenSpec";
import {getStatusModel} from "../../utils/defineStatusModel";
import {string} from "../../utils/from";
import {GenericValue} from "../../utils/generics";
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
  Examples(examples: Record<string, OS3Example>): this;

  Examples(examples: Record<string, any>): this;

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
  Of(...types: GenericValue[]): this;

  /**
   * Declare a nested generic models
   * @param generics
   */
  Nested(...generics: GenericValue[]): this;

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
  Schema(schema: Partial<JsonSchemaObject> | JsonSchema): this;

  /**
   * Add an inline title for the return model.
   * @param title
   */
  Title(title: string): this;

  /**
   *
   * @param groups
   * @constructor
   */
  Groups(...groups: string[]): this;

  [key: string]: any;
}

/**
 * @ignore
 */
function isEnum(type: any) {
  return isObject(type) && !("toJSON" in type);
}

function mapGenerics(types: GenericValue[]) {
  return types.map((type) => {
    if (isEnum(type)) {
      return string().enum(Object.values(type));
    }
    return type;
  });
}

/**
 * @ignore
 */
class ReturnDecoratorContext extends DecoratorContext<ReturnsChainedDecorators> {
  readonly methods: string[] = [
    "contentType",
    "description",
    "examples",
    "type",
    "status",
    "of",
    "nested",
    "header",
    "headers",
    "schema",
    "title",
    "groups"
  ];

  constructor({status, model}: any) {
    super();

    this.set("status", status);
    this.set("model", model);

    if (status && HTTP_STATUS_MESSAGES[status]) {
      this.set("description", HTTP_STATUS_MESSAGES[status]);

      if (!model) {
        this.model(getStatusModel(+status));
      }
    }
  }

  type(model: any) {
    return this.model(model);
  }

  model(model: any) {
    this.set("model", model);
    return this;
  }

  status(status: number | string) {
    this.set("status", status);
    return this;
  }

  headers(headers: JsonHeaders) {
    this.set("headers", {
      ...(this.get("headers") || {}),
      ...mapHeaders(headers)
    });

    return this;
  }

  header(key: string, value: string | JsonHeader) {
    return this.headers({[key]: value});
  }

  groups(...groups: string[]) {
    this.set("groups", groups);
    return this;
  }

  nested(...generics: GenericValue[]) {
    const model = this.get("model");
    this.checkPrimitive(model);
    this.checkCollection(model);

    this.addAction((ctx) => {
      (this.get("schema") as JsonSchema).nestedGenerics.push(mapGenerics(generics));
    });

    return this;
  }

  of(...types: (Type<any> | any)[]) {
    const model = this.get("model");
    this.checkPrimitive(model);

    this.addAction(() => {
      const schema = this.get("schema") as JsonSchema;

      if (isCollection(model)) {
        schema?.itemSchema({type: types[0]});
      } else {
        schema?.nestedGenerics.push(mapGenerics(types));
      }
    });

    return this;
  }

  schema(partial: Partial<JsonSchemaObject>) {
    this.addAction(() => {
      const schema = this.get("schema") as JsonSchema;

      schema!.assign(partial);
    });

    return this;
  }

  examples(examples: any) {
    this.set("examples", isString(examples) ? [examples] : examples);
    return this;
  }

  title(title: string) {
    return this.schema({title});
  }

  protected checkPrimitive(model: any) {
    if (isPrimitiveOrPrimitiveClass(model)) {
      throw new Error("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
    }
  }

  protected checkCollection(model: any) {
    if (isCollection(model)) {
      throw new Error("Returns.Nested cannot be used with the following classes: Map, Set, Array, String, Number, Boolean");
    }
  }

  protected getContentType() {
    const model = this.get("model");
    let contentType = this.get("contentType");

    if (model && !isPlainObject(model) && !isPrimitiveOrPrimitiveClass(model)) {
      contentType = contentType || "application/json";
    }

    return contentType;
  }

  protected getStatus() {
    return this.get("status") || "default";
  }

  protected onInit(args: any[], decorator: any) {
    const type = decoratorTypeOf(args);
    switch (type) {
      case DecoratorTypes.METHOD:
        this.store = JsonEntityStore.from(...args);
        if (this.store.operation) {
          this.map();
        }
        break;
      case DecoratorTypes.CLASS:
        this.decoratorType = DecoratorTypes.CLASS;
        decorateMethodsOf(args[0], decorator);
        break;
      default:
        throw new UnsupportedDecoratorType(Returns, args);
    }
  }

  protected map() {
    const model = this.get("model");
    const {store, decoratorType} = this;
    const operation = this.store.operation!;
    const currentStatus = this.getStatus();
    const response = operation.ensureResponseOf(currentStatus);
    const contentType = this.getContentType();

    let {description = response.get("description")} = this.toObject();

    if (description) {
      description = decoratorType === DecoratorTypes.CLASS ? response.get("description") || description : description;
      response.description(description);
    }

    const headers = this.getMergedKey("headers", response.get("headers"));

    if (headers) {
      response.headers(headers);
    }

    this.mapMedia(response);

    if (isSuccessStatus(this.get("status")) || currentStatus === "default") {
      if (model) {
        store.type = model;
      }
    }

    // additional info for OS2
    contentType && operation.addProduce(contentType);

    // run additional actions
    return this.runActions();
  }

  protected mapMedia(response: JsonResponse) {
    const contentType = this.getContentType();
    const model = this.get("model");
    const media = response.getMedia(contentType || "*/*");
    const schema = media.get("schema") || new JsonSchema({type: model});

    model && schema.type(model);

    this.set("schema", schema);

    media.schema(schema);

    media.groups = this.get("groups");

    const examples = this.get("examples");

    if (examples) {
      media.examples(examples);
    }

    return media;
  }
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
export function Returns(status?: string | number, model?: Type<any> | any): ReturnsChainedDecorators {
  const context = new ReturnDecoratorContext({
    status,
    model
  });

  return context.build();
}
