import {useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ClassType, Resolver} from "type-graphql";
import {AbstractClassOptions, ClassTypeResolver} from "type-graphql/dist/decorators/types";
import {PROVIDER_TYPE_RESOLVER_SERVICE} from "../constants/constants";

export function ResolverService(): ClassDecorator;
export function ResolverService(options: AbstractClassOptions): ClassDecorator;
export function ResolverService(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(...args: any[]): ClassDecorator {
  return useDecorators(
    (Resolver as any)(...args),
    Injectable({
      type: PROVIDER_TYPE_RESOLVER_SERVICE
    })
  );
}
