
import * as Express from "express";
import {MiddlewareType} from "../enums/MiddlewareType";
/**
 * @whatItDoes Represents a type that a Component or other object is instances of.
 *
 * @description
 *
 * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is be represented by
 * the `MyCustomComponent` constructor function.
 *
 * @stable
 */
export const Type = Function;

export interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 *
 */
export interface IClassArgs<T> {
    target: Type<T>;
}
/**
 *
 */
export interface IMethodArgs<T> extends IClassArgs<T> {
    propertyKey: string | symbol;
}
/**
 *
 */
export interface IAttributArgs<T> extends IClassArgs<T> {
    propertyKey: string | symbol;
}
/**
 *
 */
export interface IParamArgs<T> extends IMethodArgs<T> {
    parameterIndex: number;
}
/**
 *
 */
export interface IInjectableMethod<T> {
    target?: Type<T>;
    methodName?: string;
    designParamTypes?: any[];
    locals?: Map<Function, any>;
}
/**
 *
 */
export interface IProvider<T> {
    /**
     * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
     */
    provide: any;

    /**
     * Class to instantiate for the `token`.
     */
    useClass: Type<T>;

    /**
     *
     */
    instance?: T;

    /**
     * Provider type
     */
        type?: any;
    /**
     *
     */
    [key: string]: any;
}
/**
 *
 */
export interface IInvokableScope {
    request: Express.Request;
    response: Express.Response;
    next: Function;
    err?: any;
    [service: string]: any;
}

export interface IJsonMetadata<T> {
    name?: string;
    propertyKey?: string;
    use?: {new(): T};
    isCollection?: boolean;
    baseType?: any;
}
/**
 *
 */
export interface IFilter {
    transform?(expression: string, request:  Express.Request, response:  Express.Response): any;
}
/**
 *
 */
export interface IFilterProvider<T extends IFilter> extends IProvider<T> {

}
/**
 *
 */
export interface IMiddleware {
    use?: Function;
}

export interface IMiddlewareError {
    use?: Function;
}

/**
 *
 */
export interface IInjectableMiddlewareMethod {
    target: any;
    methodName: string;
    length: number;
    type: MiddlewareType;
    handler: () => Function;
    injectable: boolean;
    hasNextFn: boolean;
}
/**
 *
 */
export interface IMiddlewareProvider<T extends IMiddleware> extends IProvider<T> {
    type: MiddlewareType;
}
/**
 *
 */
export interface IConverter {
    deserialize?(data: any, targetType?: any, baseType?: any): any;
    serialize?(object: any): any;
}
/**
 *
 */
export interface IControllerRoute {
    method: string;
    name: string;
    url: string;
    className: string;
    methodClassName: string;
    parameters: any;
    returnType: any;
}
/**
 *
 */
export interface IInjectableParamsMetadata<T> {
    required?: boolean;
    expression?: string | RegExp;
    useType?: Type<T>;
    baseType?: Type<T>;
    useConverter?: boolean;
}

export interface IInjectableParamSettings<T> extends IInjectableParamsMetadata<T>, IParamArgs<T> {

}