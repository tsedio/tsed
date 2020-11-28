import {ClassType, Resolver} from "type-graphql";
import {ClassTypeResolver, AbstractClassOptions} from "type-graphql/dist/decorators/types";
import {registerResolverService} from "../registries/ResolverServiceRegistry";

export function ResolverService(): ClassDecorator;
export function ResolverService(options: AbstractClassOptions): ClassDecorator;
export function ResolverService(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator;
export function ResolverService(...args: any[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): void => {
    Resolver.apply(this, args)(target);
    registerResolverService(target);
  };
}
