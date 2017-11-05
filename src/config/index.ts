import {InjectorService} from "../di/services/InjectorService";
import {ServerSettingsProvider} from "./class/ServerSettingsProvider";
import {ServerSettingsService} from "./services/ServerSettingsService";

export const globalServerSettings = new ServerSettingsProvider();

InjectorService.factory(ServerSettingsService, globalServerSettings);

export * from "./interfaces/IRouterOptions";
export * from "./interfaces/IServerSettings";
export * from "./decorators/constant";
export * from "./decorators/value";
export * from "./class/ServerSettingsProvider";
export * from "./services/ServerSettingsService";
