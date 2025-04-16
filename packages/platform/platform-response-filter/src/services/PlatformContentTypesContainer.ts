import type {Type} from "@tsed/core";
import {constant, inject, injectable, type TokenProvider} from "@tsed/di";

import {ContentTypes} from "../constants/ContentTypes.js";
import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer.js";
import type {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";

function factory() {
  const responseFilters = constant<Type<ResponseFilterMethods>[]>("responseFilters", []);
  const containers: Map<ResponseFilterKey, TokenProvider> = new Map();

  ResponseFiltersContainer.forEach((token, type) => {
    if (responseFilters.includes(token)) {
      containers.set(type, token);
    }
  });

  return {
    contentTypes: [...containers.keys()],
    resolve(bestContentType: string) {
      const token = containers.get(bestContentType) || containers.get(ContentTypes.ANY);

      if (token) {
        return inject<ResponseFilterMethods>(token);
      }
    }
  };
}

export type PLATFORM_CONTENT_TYPES_CONTAINER = ReturnType<typeof factory>;
export const PLATFORM_CONTENT_TYPES_CONTAINER = injectable(Symbol.for("PLATFORM_CONTENT_TYPES_CONTAINER")).factory(factory).token();
