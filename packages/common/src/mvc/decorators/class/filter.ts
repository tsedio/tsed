import {registerFilter} from "../../registries/FilterRegistry";

/**
 * Filter decorator declare a class as new Filter component.
 *
 * See [filters](/docs/filters.md) section for more information.
 *
 * @decorator
 * @deprecated
 * @classDecorator
 */
export function Filter(): Function {
  return registerFilter;
}
