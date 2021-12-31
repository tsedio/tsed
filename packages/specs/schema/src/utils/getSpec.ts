import {cleanObject, Type, uniqBy} from "@tsed/core";
import {OpenSpec3} from "@tsed/openspec";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSchemaOptions} from "../interfaces";
import {buildPath} from "./buildPath";
import {getJsonEntityStore} from "./getJsonEntityStore";
import {getOperationsStores} from "./getOperationsStores";
import {mergeOperation} from "./mergeOperation";
import {operationIdFormatter} from "./operationIdFormatter";

export interface SpecSerializerOptions extends JsonSchemaOptions {
  specType?: SpecTypes.OPENAPI;
  /**
   * Paths
   */
  paths?: any;
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

/**
 * Return the swagger or open spec for the given class.
 * @param model
 * @param options
 */
export function getSpec(model: Type<any>, options: SpecSerializerOptions = {}): Partial<OpenSpec3> {
  if (!options.specType) {
    options.specType = SpecTypes.OPENAPI;
  }

  options = {
    ...options,
    operationIdFormatter: options.operationIdFormatter || operationIdFormatter(options.operationIdPattern),
    root: false,
    specType: options.specType
  };

  return get(model, options, () => {
    const store = getJsonEntityStore(model);
    const {specType = SpecTypes.OPENAPI, schemas = {}, paths = {}, rootPath = "/", tags = []} = options;
    const ctrlPath = store.path;
    const defaultTags = cleanObject({
      name: store.schema.getName(),
      description: store.schema.get("description")
    });

    const specJson: any = {paths};

    getOperationsStores(model).forEach((operationStore) => {
      if (operationStore.store.get("hidden")) {
        return;
      }

      const operation = operationStore.operation!.toJSON({...options, specType, schemas});

      operationStore.operation!.operationPaths.forEach(({path, method}: {path: string; method: string}) => {
        if (method) {
          mergeOperation(specJson, operation, {
            rootPath: buildPath(rootPath + ctrlPath),
            path,
            method,
            defaultTags,
            tags,
            specType,
            operationId: (path: string) =>
              options.operationIdFormatter!(
                operationStore.parent.schema.get("name") || operationStore.parent.targetName,
                operationStore.propertyName,
                path
              )
          });
        }
      });
    });

    specJson.tags = uniqBy(tags, "name");

    if (Object.keys(schemas).length) {
      if (specType === SpecTypes.OPENAPI) {
        specJson.components = {
          schemas
        };
      } else {
        specJson.definitions = schemas;
      }
    }

    return specJson;
  });
}
