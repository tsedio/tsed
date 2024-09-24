import {cleanObject, isArray, Type, uniqBy} from "@tsed/core";
import {OpenSpec3} from "@tsed/openspec";

import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {getJsonEntityStore} from "./getJsonEntityStore.js";
import {mergeSpec} from "./mergeSpec.js";
import {operationIdFormatter} from "./operationIdFormatter.js";

export type JsonTokenOptions = ({token: Type<any>} & Partial<SpecSerializerOptions>)[];

export interface SpecSerializerOptions extends JsonSchemaOptions {
  /**
   * Paths
   */
  paths?: Record<string, any>;
  /**
   * Channels
   */
  channels?: Record<string, any>;
  /**
   * Root path. This paths will be added to all generated paths Object.
   */
  rootPath?: string;
  /**
   * A function to generate the operationId.
   */
  operationIdFormatter?: (name: string, propertyKey: string, path: string) => string;
  /**
   * A pattern to generate the operationId.
   */
  operationIdPattern?: string;
}

/**
 * @ignore
 */
const caches: Map<Type<any>, Map<string, any>> = new Map();

/**
 * @ignore
 */
function get(model: Type<any>, options: any, cb: any) {
  if (!caches.has(model)) {
    caches.set(model, new Map());
  }

  const cache = caches.get(model)!;
  const key = JSON.stringify(options);

  if (!cache.has(key)) {
    cache.set(key, cb());
  }

  return cache.get(key);
}

function generate(model: Type<any>, options: SpecSerializerOptions) {
  const store = getJsonEntityStore(model);
  const {rootPath = "/"} = options;

  options = {
    ...options,
    rootPath,
    defaultTags: [
      cleanObject({
        name: store.schema.getName(),
        description: store.schema.get("description")
      })
    ]
  };

  return execMapper("generate", [store], options);
}

/**
 * Return the swagger or open spec for the given class.
 * @param model
 * @param options
 */
export function getSpec(model: Type<any> | JsonTokenOptions, options: SpecSerializerOptions = {}): Partial<OpenSpec3> {
  options = {
    specType: SpecTypes.OPENAPI,
    ...options,
    tags: [],
    paths: {},
    channels: {},
    components: {},
    operationIdFormatter: options.operationIdFormatter || operationIdFormatter(options.operationIdPattern),
    root: false
  };

  if (isArray(model)) {
    let finalSpec: any = {};

    options = {
      ...options,
      append(spec: any) {
        finalSpec = mergeSpec(finalSpec, spec);
      }
    };

    model.forEach(({token, ...opts}) => {
      const spec = getSpec(token, {
        ...options,
        ...opts
      });

      options.append(spec);
    });

    return finalSpec;
  }

  return get(model, options, () => generate(model, options));
}
