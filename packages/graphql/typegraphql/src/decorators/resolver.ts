import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ClassType, Resolver} from "type-graphql";

import {RESOLVERS_PROVIDERS} from "../constants/constants.js";

export interface ResolverControllerOptions {
  id?: string;
}

export function ResolverController(): ClassDecorator;
export function ResolverController(path: string): ClassDecorator;
export function ResolverController(typeFunc: (of?: void) => ClassType | Function, options?: ResolverControllerOptions): ClassDecorator;
export function ResolverController(objectType: ClassType, options?: ResolverControllerOptions): ClassDecorator;
export function ResolverController(...args: any[]): ClassDecorator {
  let id = undefined;
  switch (args.length) {
    case 1:
      if (typeof args[0] === "string") {
        id = args[0];
      } else {
        id = args[0].id;
        delete args[0].id;
      }
      break;
    case 2:
      id = args[1].id;
      delete args[1].id;
      break;
  }
  return useDecorators(
    (Resolver as any)(...args),
    Injectable({
      type: RESOLVERS_PROVIDERS
    }),
    StoreSet("graphql", {
      id
    })
  );
}
