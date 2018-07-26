import {JsonSchema, PathParamsType} from "@tsed/common";
import {deepExtends} from "@tsed/core";

/** */

export function parseSwaggerPath(base: string, path: PathParamsType = ""): {path: string; pathParams: any[]}[] {
  if (path instanceof RegExp) {
    path = path
      .toString()
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\\/, "");
  }

  const params: any[] = [];
  const paths: any[] = [];
  let isOptional = false;
  let current = "";

  ("" + base + path)
    .split("/")
    .filter(o => !!o)
    .map(key => {
      const name = key.replace(":", "").replace("?", "");

      if (key.indexOf(":") > -1) {
        const optional = key.indexOf("?") > -1;

        // Append previous config
        if (optional && !isOptional) {
          isOptional = true;

          paths.push({
            path: current,
            pathParams: [].concat(params as any)
          });
        }

        current += "/{" + name + "}";

        params.push({
          in: "path",
          name,
          type: "string",
          required: true
        });

        if (optional && isOptional) {
          paths.push({
            path: current,
            pathParams: [].concat(params as any)
          });
        }
      } else {
        current += "/" + key;
      }
    });

  return paths.length
    ? paths
    : [
        {
          path: current,
          pathParams: [].concat(params as any)
        }
      ];
}

/**
 *
 * @param type
 * @returns {string | string[]}
 */
export function swaggerType(type: any): string {
  return JsonSchema.getJsonType(type) as any;
}

/**
 * Filter the null type, unsupported by swagger and apply the right type on schema.
 * @param schema
 * @param type
 */
export function swaggerApplyType(schema: any, type: any): any {
  const types = []
    .concat(swaggerType(type) as any)
    .filter(type => {
      if (type === "null") {
        schema.nullable = true;

        return false;
      }

      return type;
    })
    .map(type => String(type));

  if (types.length === 1) {
    schema.type = types[0];
  } else {
    delete schema.type;
    schema.oneOf = types.map(type => ({type}));
  }

  return schema;
}

/**
 *
 * @returns {{[p: string]: (collection: any[], value: any) => any}}
 */
export function getReducers(): {[key: string]: (collection: any[], value: any) => any} {
  const defaultReducer = (collection: any[], value: any) => {
    if (collection.indexOf(value) === -1) {
      collection.push(value);
    }

    return collection;
  };

  return {
    default: defaultReducer,
    security: (collection, value) => {
      const current = collection.find(
        (current: any): any => {
          return Object.keys(value).find(key => !!current[key]);
        }
      );

      if (current) {
        deepExtends(current, value, {default: defaultReducer});
      } else {
        collection.push(value);
      }

      return collection;
    },
    parameters: (collection, value) => {
      const current = collection.find(current => current.in === value.in && current.name === value.name);

      if (current) {
        deepExtends(current, value);
      } else {
        collection.push(value);
      }

      return collection;
    },
    oneOf: (collection, value) => {
      const current = collection.find(current => current.type === value.type);

      if (current) {
        deepExtends(current, value);
      } else {
        collection.push(value);
      }

      return collection;
    }
  };
}
