import {TerminusOptions} from "@godaddy/terminus";

export type TerminusSettings = Omit<
  TerminusOptions,
  "healthChecks" | "onSignal" | "onSendFailureDuringShutdown" | "onShutdown" | "beforeShutdown" | "onSigterm"
> & {path?: string};
