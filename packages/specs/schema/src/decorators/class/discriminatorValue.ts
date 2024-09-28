import {snakeCase} from "change-case";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Declare a Discriminator value on a child class.
 *
 * ```ts
 * export class Event {
 *   @DiscriminatorKey() // declare this property a discriminator key
 *   type: string;
 *
 *   @Property()
 *   value: string;
 * }
 *
 * @DiscriminatorValue("page_view")
 * export class PageView extends Event {
 *   @Required()
 *   url: string;
 * }
 *
 * @DiscriminatorValue("action")
 * export class Action extends Event {
 *   @Required()
 *   event: string;
 * }
 *
 * @DiscriminatorValue()
 * export class CustomAction extends Event {
 *   @Required()
 *   event: string;
 *
 *   @Property()
 *   meta: string;
 * }
 * ```
 *
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @param value
 * @param values
 */
export function DiscriminatorValue(value?: string, ...values: string[]): ClassDecorator {
  return JsonEntityFn((store) => {
    value = value || snakeCase(store.targetName);
    if (store.discriminatorAncestor) {
      store.schema.discriminatorValue(value, ...values);
    }
  });
}
