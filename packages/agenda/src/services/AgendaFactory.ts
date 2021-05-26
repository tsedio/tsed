import {Configuration, registerProvider} from "@tsed/di";
import {Agenda, AgendaConfig} from "agenda";

// create Alias to avoid confusing import between Agenda from "agenda" and Agenda decorator
export const AgendaService: Agenda = Agenda;

registerProvider({
  provide: Agenda,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    return new Agenda(settings.get<AgendaConfig>("agenda", {}));
  }
});
