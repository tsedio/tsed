import {Configuration, registerProvider} from "@tsed/di";
import {Agenda, AgendaConfig} from "agenda";

// create Alias to avoid confusing import between Agenda from "agenda" and Agenda decorator
export const AgendaService = Agenda;
export type AgendaService = Agenda;

registerProvider({
  token: Agenda,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const opts = settings.get<AgendaConfig & {enabled: boolean}>("agenda", {enabled: false});
    return opts.enabled ? new Agenda(opts) : {};
  }
});
