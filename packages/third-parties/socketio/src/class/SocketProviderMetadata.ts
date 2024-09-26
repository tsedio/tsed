import type {SocketHandlerMetadata} from "../interfaces/SocketHandlerMetadata.js";
import type {SocketInjectableNsp} from "../interfaces/SocketInjectableNsp.js";
import type {SocketProviderTypes} from "../interfaces/SocketProviderTypes.js";

export class SocketProviderMetadata {
  public type: SocketProviderTypes;
  public namespace: string | RegExp;
  public error: boolean = false;
  public injectNamespaces: SocketInjectableNsp[] = [];
  public useBefore: any[] = [];
  public useAfter: any[] = [];
  public handlers: Record<string, SocketHandlerMetadata> = {};

  constructor(options: Partial<SocketProviderMetadata> = {}) {
    options.type && (this.type = options.type);
    options.namespace && (this.namespace = options.namespace);
    options.error && (this.error = options.error);
    options.injectNamespaces && (this.injectNamespaces = options.injectNamespaces);
    options.useBefore && (this.useBefore = options.useBefore);
    options.useAfter && (this.useAfter = options.useAfter);
    options.handlers && (this.handlers = options.handlers);
  }

  get useHandler() {
    return this.get("use");
  }

  get $onConnection() {
    return this.get("$onConnection");
  }

  get $onDisconnect() {
    return this.get("$onDisconnect");
  }

  get(key: string): SocketHandlerMetadata {
    return this.handlers[key];
  }

  set(key: string, metadata: SocketHandlerMetadata): void {
    this.handlers[key] = metadata;
  }

  getHandlers() {
    return Object.entries(this.handlers)
      .filter(([key]) => ["$onConnection", "$onDisconnect"].indexOf(key) === -1)
      .map(([, handler]) => handler);
  }

  createHook(hook: string, eventName: string): void {
    this.set(hook, {
      ...(this.get(hook) || {}),
      eventName,
      methodClassName: hook
    });
  }
}
