import {registerFactory} from "../di/registries/ProviderRegistry";
import {globalServerSettings} from "./services/GlobalSettings";
import {ServerSettingsService} from "./services/ServerSettingsService";

export * from "./interfaces/IServerSettings";
export * from "./decorators/constant";
export * from "./decorators/value";
export * from "./class/ServerSettingsProvider";
export * from "./services/ServerSettingsService";
export * from "./services/GlobalSettings";

registerFactory(ServerSettingsService, globalServerSettings);
