import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";

import {DEFAULT_CONTEXT_NAME, SUBSCRIBER_INJECTION_TYPE} from "../constants.js";

/**
 * Register a new subscriber for the given context name.
 * @decorator
 * @mikroOrm
 */
export const Subscriber = (options: {contextName: string} = {contextName: DEFAULT_CONTEXT_NAME}) =>
  useDecorators(Injectable({type: SUBSCRIBER_INJECTION_TYPE}), StoreSet(SUBSCRIBER_INJECTION_TYPE, options));
