import "./services/AjvService";
import {IAjvSettings} from "./interfaces/IAjvSettings";

declare module "@tsed/common" {
  export interface IServerSettingsOptions {
    ajv: IAjvSettings;
  }
}
