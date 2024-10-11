import {Type, useDecorators} from "@tsed/core";
import {Controller} from "@tsed/di";
import {UseBefore} from "@tsed/platform-middlewares";

import {INTERACTIONS} from "../constants/constants.js";
import {OidcInteractionMiddleware} from "../middlewares/OidcInteractionMiddleware.js";
import {NoCache} from "./noCache.js";

export interface InteractionsOptions {
  path: string;
  children: Type<any>[];
}

export function Interactions(options: InteractionsOptions): ClassDecorator {
  const {path} = options;
  return useDecorators(
    Controller({path, children: options.children, subType: INTERACTIONS}),
    NoCache(),
    UseBefore(OidcInteractionMiddleware)
  );
}
