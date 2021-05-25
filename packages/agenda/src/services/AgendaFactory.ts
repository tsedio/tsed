import {Configuration, registerProvider} from "@tsed/di";
import {Agenda, AgendaConfig} from "agenda";

registerProvider({
  provide: Agenda,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    return new Agenda(settings.get<AgendaConfig>("agenda", {}));
  }
});
