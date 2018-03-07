import {InjectorService} from "../../di/services/InjectorService";
import {ServerSettingsProvider} from "../class/ServerSettingsProvider";
import {ServerSettingsService} from "./ServerSettingsService";

export const globalServerSettings = new ServerSettingsProvider();
export const GlobalServerSettings = globalServerSettings;

InjectorService.factory(ServerSettingsService, globalServerSettings);