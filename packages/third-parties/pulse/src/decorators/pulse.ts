import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {PROVIDER_TYPE_PULSE} from "../constants/constants.js";

interface PulseOptions {
  namespace?: string;
}

/**
 * Declare a class as a Pulse jobs controller.
 *
 * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
 * Use `JobsController` from `@tsed/agenda` instead.
 */
export function JobsController(options?: PulseOptions): ClassDecorator {
  return useDecorators(
    options?.namespace && StoreMerge("pulse", options),
    Injectable({
      type: PROVIDER_TYPE_PULSE
    })
  );
}

/**
 * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
 * Use `JobsController` from `@tsed/agenda` instead.
 */
export const Pulse: typeof JobsController = JobsController;
