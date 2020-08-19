import {Example as E} from "@tsed/common";

/**
 * Add a example metadata on the decorated element.
 *
 * ::: warning
 * This decorator will be removed in v7.
 *
 * For v5 user, use @@Example@@ from @tsed/common instead of @tsed/swagger.
 *
 * For v6 user, use @@Example@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 * @ignore
 * @deprecated Use @Example from @tsed/common instead.
 */
export function Example(example: any): Function;
export function Example(name: string, description: string): ClassDecorator;
export function Example(...args: any[]): Function {
  // @ts-ignore
  return E(...args);
}
