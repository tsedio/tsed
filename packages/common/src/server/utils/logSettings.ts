import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";

const IGNORE_KEYS = ["components"];

export function logSettings(settings: ServerSettingsService) {
  settings.forEach((value, key) => {
    if (IGNORE_KEYS.indexOf(key) === -1) {
      $log.info(`settings.${key} =>`, JSON.stringify(value));
    }
  });
}
