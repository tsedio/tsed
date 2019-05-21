import {ServerSettingsService} from "@tsed/common";
import {registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider({
  provide: CONNECTION,
  deps: [ServerSettingsService],
  useFactory(settings: ServerSettingsService) {
    const options = settings.get("myOptions");

    return new DatabaseConnection(options);
  }
});
