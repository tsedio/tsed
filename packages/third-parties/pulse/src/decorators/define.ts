import {DefineOptions, PulseStore} from "../interfaces/PulseStore.js";
import {Store} from "@tsed/core";

/**
 * Register the decorated method as a Pulse job processor.
 *
 * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
 * Use `Define` from `@tsed/agenda` instead.
 */
export function Define(options: DefineOptions = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: PulseStore = {
      define: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge("pulse", store);
  };
}
