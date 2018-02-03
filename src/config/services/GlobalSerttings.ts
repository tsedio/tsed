import {InjectorService} from "../../di/services/InjectorService";
import {ServerSettingsProvider} from "../class/ServerSettingsProvider";
import {ServerSettingsService} from "./ServerSettingsService";

export const globalServerSettings = new ServerSettingsProvider();

InjectorService.factory(ServerSettingsService, globalServerSettings);