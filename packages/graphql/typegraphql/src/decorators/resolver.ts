import {useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ClassType, Resolver} from "type-graphql";
import {AbstractClassOptions, ClassTypeResolver} from "type-graphql/dist/decorators/types";
import {RESOLVERS_PROVIDERS} from "../constants/constants";

export function ResolverController(): ClassDecorator;
export function ResolverController(options: AbstractClassOptions): ClassDecorator;
export function ResolverController(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator;
export function ResolverController(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator;
export function ResolverController(...args: any[]): ClassDecorator {
  return useDecorators(
    (Resolver as any)(...args),
    Injectable({
      type: RESOLVERS_PROVIDERS
    })
  );
}

/**
 * @deprecated Use ResolverController instead
 */
export function ResolverService(): ClassDecorator;
export function ResolverService(options: AbstractClassOptions): ClassDecorator;
export function ResolverService(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(...args: any[]): ClassDecorator {
  return (ResolverController as any)(...args);
}
