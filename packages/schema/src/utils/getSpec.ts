import {cleanObject, Type, uniqBy} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSerializerOptions} from "../interfaces";
import {buildPath} from "./buildPath";
import {getOperationsStores} from "./getOperationsStores";
import {mergeOperation} from "./mergeOperation";
import {operationIdFormatter} from "./operationIdFormatter";

export interface SpecSerializerOptions extends JsonSerializerOptions {
  /**
   * Paths
   */
  paths?: any;
  /**
   *
   */
  rootPath?: string;
  /**
   *
   * @param target
   * @param propertyKey
   */
  operationIdFormatter?: (name: string, propertyKey: string, path: string) => string;
  /**
   *
   */
  operationIdPattern?: string;
}

const caches: Map<Type<any>, Map<string, any>> = new Map();

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

/**
 * Return the swagger or open spec for the given class
 * @param model
 * @param options
 */
export function getSpec(model: Type<any>, options: SpecSerializerOptions = {}) {
  if (!options.spec || options.spec === SpecTypes.JSON) {
    options.spec = SpecTypes.SWAGGER;
  }

  options = {
    operationIdFormatter: options.operationIdFormatter || operationIdFormatter(options.operationIdPattern),
    ...options,
    root: false,
    spec: options.spec
  };

  return get(model, options, () => {
    const store = JsonEntityStore.from(model);
    const {spec = SpecTypes.SWAGGER, schemas = {}, paths = {}, rootPath = "/", tags = []} = options;
    const ctrlPath = store.path;
    const defaultTags = cleanObject({
      name: store.schema.getName(),
      description: store.schema.get("description")
    });

    const specJson: any = {paths};

    getOperationsStores(model).forEach(operationStore => {
      const operation = operationStore.operation!.toJSON({...options, spec, schemas});

      operationStore.operation!.operationPaths.forEach(({path, method}: {path: string; method: string}) => {
        if (method) {
          mergeOperation(specJson, operation, {
            rootPath: buildPath(rootPath + ctrlPath),
            path,
            method,
            defaultTags,
            tags,
            operationId: (path: string) =>
              options.operationIdFormatter?.(
                operationStore.parent.schema.get("name") || operationStore.parent.targetName,
                operationStore.propertyName,
                path
              )
          });
        }
      });
    });

    specJson.tags = uniqBy(tags, "name");

    if (spec === SpecTypes.OPENAPI) {
      specJson.components = {
        schemas
      };
    } else {
      specJson.definitions = schemas;
    }

    return specJson;
  });
}
