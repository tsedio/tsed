import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {OpenSpecTag} from "@tsed/openspec";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

function mapTags(tags: (string | OpenSpecTag)[]) {
  return tags.map((tag) => {
    if (typeof tag === "string") {
      return {
        name: tag
      };
    }

    return tag;
  });
}

/**
 * Add metadata tags to the decorated element (class or method).
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class MyController {
 *  @Tags("api")
 *  get() {}
 * }
 * ```
 * ### On Class
 *
 * ```typescript
 * @Controller("/")
 * @Tags("api")
 * class MyController {
 *  get() {}
 * }
 * ```
 *
 * @param tags
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 */
export function Tags(...tags: (string | OpenSpecTag)[]): ClassDecorator & MethodDecorator {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.addTags(mapTags(tags));
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Tags(...tags));
        break;

      default:
        throw new UnsupportedDecoratorType(Tags, args);
    }
  });
}
