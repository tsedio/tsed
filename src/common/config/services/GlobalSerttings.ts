import {registerFactory} from "../../di/registries/ProviderRegistry";
import {ServerSettingsProvider} from "../class/ServerSettingsProvider";
import {ServerSettingsService} from "./ServerSettingsService";

export const globalServerSettings = new ServerSettingsProvider();
export const GlobalServerSettings = globalServerSettings;

registerFactory(ServerSettingsService, globalServerSettings);