import {EveryOptions, PulseStore} from "../interfaces/PulseStore.js";
import {Store, useDecorators} from "@tsed/core";
import {Define} from "./define.js";

/**
 * Schedule the decorated method as a recurring Pulse job.
 *
 * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
 * Use `Every` from `@tsed/agenda` instead.
 */
export function Every(interval: string, options: EveryOptions = {}): MethodDecorator {
  return useDecorators(Define(options), (target: Object, propertyKey: string) => {
    const store: PulseStore = {
      every: {
        [propertyKey]: {...options, interval}
      }
    };
    Store.from(target).merge("pulse", store);
  });
}
