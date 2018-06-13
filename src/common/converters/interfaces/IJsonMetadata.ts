/**
 * @module core/converters
 */
/**
 *
 */
export interface IJsonMetadata<T> {
  name?: string;
  propertyKey?: string;
  use?: {new (): T};
  isCollection?: boolean;
  baseType?: any;
}
