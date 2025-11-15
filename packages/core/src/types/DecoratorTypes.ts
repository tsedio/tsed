/**
 * Normalized decorator kinds recognized by Ts.ED.
 *
 * This enum helps identify, at runtime, the element a decorator applies to
 * (parameter, property, method, class, and static/constructor variants).
 *
 * @public
 */
export enum DecoratorTypes {
  /** Decorator applied to an instance parameter */
  PARAM = "parameter",
  /** Decorator applied to a constructor parameter */
  PARAM_CTOR = "parameter.constructor",
  /** Decorator applied to a static method parameter */
  PARAM_STC = "parameter.static",
  /** Decorator applied to an instance property */
  PROP = "property",
  /** Decorator applied to a static property */
  PROP_STC = "property.static",
  /** Decorator applied to an instance method */
  METHOD = "method",
  /** Decorator applied to a static method */
  METHOD_STC = "method.static",
  /** Decorator applied to a class */
  CLASS = "class"
}
