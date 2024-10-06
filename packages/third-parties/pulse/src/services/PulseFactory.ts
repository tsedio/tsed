import {Pulse, PulseConfig} from "@pulsecron/pulse";
import {Configuration, registerProvider} from "@tsed/di";

// create Alias to avoid confusing import between Pulse from "@pulsecron/pulse" and Pulse decorator
export const PulseService = Pulse;
export type PulseService = Pulse;

registerProvider({
  provide: Pulse,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const opts = settings.get<PulseConfig & {enabled: boolean}>("pulse", {enabled: false});
    return opts.enabled ? new Pulse(opts) : {};
  }
});
