import "./services/AjvService";
import {IAjvSettings} from "./interfaces/IAjvSettings";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    ajv: IAjvSettings;
  }
}
