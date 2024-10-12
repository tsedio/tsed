import {NativeConnection, NativeConnectionOptions, Worker, WorkerOptions} from "@temporalio/worker";
import {$log} from "@tsed/logger";
import {PlatformBuilderSettings} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";

import {TemporalModule} from "../TemporalModule.js";

type BootstrapWorkerOptions = {
  platform?: PlatformBuilderSettings;
  worker: Omit<WorkerOptions, "activities">;
  connection?: NativeConnection | NativeConnectionOptions;
};

export async function bootstrapWorker(mod: any, settings: BootstrapWorkerOptions) {
  // TODO remove this code and use production
  await PlatformTest.bootstrap(mod, settings.platform)();
  const temporalioModule = PlatformTest.get<TemporalModule>(TemporalModule);
  const activities = temporalioModule.getActivities();
  $log.info('Starting temporal worker with queue "%s" and activities:', settings.worker.taskQueue);

  if (Object.keys(activities).length > 0) {
    $log.printTable(
      Object.entries(activities).map((x) => ({
        name: x[0],
        activity: x[1].toString()
      }))
    );
  }

  let connection: NativeConnection;
  if (settings.connection instanceof NativeConnection) {
    connection = settings.connection;
  } else {
    $log.info("Connecting to Temporal Server: ", settings.connection?.address || "default");
    connection = await NativeConnection.connect(settings.connection);
  }

  const worker = await Worker.create({
    connection,
    ...settings.worker,
    activities
  });

  return worker;
}
