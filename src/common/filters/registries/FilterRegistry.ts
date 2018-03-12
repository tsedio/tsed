import {Registry} from "@tsed/core";
import {IProvider} from "../../di/interfaces/IProvider";
import {FilterProvider} from "../class/FilterProvider";
import {IFilterPreHandler} from "../interfaces/IFilterPreHandler";

export const FilterRegistry = new Registry<FilterProvider, IProvider<any>>(FilterProvider);
export const FilterPreHandlers: Map<symbol, IFilterPreHandler> = new Map();
