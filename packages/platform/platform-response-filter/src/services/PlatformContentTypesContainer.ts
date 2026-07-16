import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer.js";
import {type TokenProvider, constant, inject, injectable} from "@tsed/di";
import {ContentTypes} from "../constants/ContentTypes.js";
import type {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
import type {Type} from "@tsed/core";

export const PLATFORM_CONTENT_TYPES_CONTAINER = injectable(Symbol.for("PLATFORM_CONTENT_TYPES_CONTAINER"))
  .factory(() => {
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
  })
  .token();

export type PLATFORM_CONTENT_TYPES_CONTAINER = typeof PLATFORM_CONTENT_TYPES_CONTAINER;
