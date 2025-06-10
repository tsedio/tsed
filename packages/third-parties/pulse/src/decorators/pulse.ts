import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";

import {PROVIDER_TYPE_PULSE} from "../constants/constants.js";

interface PulseOptions {
  namespace?: string;
}

export function JobsController(options?: PulseOptions): ClassDecorator {
  return useDecorators(
    options?.namespace && StoreMerge("pulse", options),
    Injectable({
      type: PROVIDER_TYPE_PULSE
    })
  );
}

/**
 * @deprecated Use `JobsController` instead.
 */
export const Pulse: typeof JobsController = JobsController;
