import {DecoratorTypes, Type} from "@tsed/core";
import type {JsonEntityStore} from "../domain/JsonEntityStore";

/**
 * @ignore
 */
export const JsonEntitiesContainer = new Map<DecoratorTypes | "default", Type<JsonEntityStore>>();
