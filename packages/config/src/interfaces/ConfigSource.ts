import type {Type} from "@tsed/core";
import {JsonSchema} from "@tsed/schema";

export interface ConfigSourceOptions<Opts = any> {
  /**
   * The name of the configuration provider.
   */
  name?: string;

  /**
   * The priority of the configuration provider. Higher priority providers will override values from lower priority providers.
   * @default 0
   */
  priority?: number;

  /**
   * Whether to enable the configuration provider.
   * @default true
   */
  enabled?: boolean;
  /**
   * The ConfigSource to use for loading configuration values.
   * @param args
   */
  use: Type<ConfigSource<Opts>>;
  /**
   * Options for the configuration provider.
   */
  options: Opts;
  /**
   * The schema to validate the configuration values against.
   */
  validationSchema?: JsonSchema;
  /**
   * Enable FileSystem Watch mode. ConfigSource must implement the `watch()` method.
   */
  watch?: boolean;
  /**
   * Refresh strategy. Ts.ED can refresh ConfigSource during the "$onRequest" or "$onResponse" hook.
   *
   * Note: refresh data during `$onRequest` can degrade performance depending on the ConfigSource type.
   * We recommend to refresh data during the $onResponse hook (action are asynchronous).
   */
  refreshOn?: "request" | "response";
}

export type InitialConfigSourceOptions = Omit<ConfigSourceOptions, "options" | "use">;
export type ConfigSourceWatchCloseCB = () => Promise<void> | void;
export type ConfigSourceOnChangeCB = () => void;

/**
 * Interface for a configuration source that can provide configuration values.
 */
export interface ConfigSource<Opts = any> {
  options: Opts;

  $onInit?(): Promise<void> | void;
  /**
   * Load configuration from the source.
   */
  getAll(): Promise<Record<string, unknown>> | Record<string, unknown>;

  watch?(onChange?: ConfigSourceOnChangeCB): Promise<ConfigSourceWatchCloseCB> | ConfigSourceWatchCloseCB;
}

export type ConfigurationExtends = (Type<ConfigSource> | ConfigSourceOptions)[];
