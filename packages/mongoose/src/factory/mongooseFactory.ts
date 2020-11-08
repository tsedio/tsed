import {importProviders} from "@tsed/di";
import {getValue} from "@tsed/core";
import {createContainer, InjectorService, setLoggerLevel} from "@tsed/di";
import {$log} from "@tsed/logger";
import {MDBConnection} from "@tsed/mongoose";
import {MongooseModule} from "../MongooseModule";

export interface MongooseFactoryOptions extends Omit<TsED.Configuration, "mongoose"> {
  databases: Omit<MDBConnection, "id"> | MDBConnection[];
}

$log.name = "TSED";

/**
 * Create injector and services for a mongoose application in standalone.
 *
 * @param settings
 * @param container
 */
export async function mongooseFactory(settings: MongooseFactoryOptions, container = createContainer()): Promise<InjectorService> {
  const injector = new InjectorService();
  injector.logger = $log;

  // @ts-ignore
  injector.settings.set({
    ...settings,
    logger: {
      ...getValue(settings, "logger", {}),
      level: getValue(settings, "logger.level", "off")
    },
    mongoose: settings.databases
  });

  setLoggerLevel(this.injector);

  await importProviders(this.injector);

  // Clone all providers in the container
  injector.addProviders(container);

  // Resolve all configuration
  injector.resolveConfiguration();

  injector.settings.forEach((value, key) => {
    injector.logger.debug(`settings.${key} =>`, value);
  });

  injector.invoke(MongooseModule);

  await injector.load(container);

  return injector;
}
