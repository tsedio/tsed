import {PulseConfig} from "@pulsecron/pulse";

/**
 * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
 * Use `AgendaSettings` from `@tsed/agenda` with `agenda.backend: new MongoBackend(...)` instead.
 */
export type PulseSettings = PulseConfig & {
  enabled?: boolean;
  disableJobProcessing?: boolean;
  drainJobsBeforeClose?: boolean;
};

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * @deprecated `@tsed/pulse` is deprecated and will be removed in a future major release. Migrate to `@tsed/agenda` (Agenda v6). See https://tsed.dev/tutorials/pulse.html#migrate-to-tsed-agenda
       * Use the `agenda` configuration key from `@tsed/agenda` instead.
       */
      pulse?: PulseSettings;
    }
  }
}
