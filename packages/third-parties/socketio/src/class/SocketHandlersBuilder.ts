import {isFunction, Store} from "@tsed/core";
import {DIContext, InjectorService, Provider, runInContext} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {$log} from "@tsed/logger";
import {Namespace, Socket} from "socket.io";
import {v4} from "uuid";

import {SocketFilters} from "../interfaces/SocketFilters.js";
import {SocketHandlerMetadata} from "../interfaces/SocketHandlerMetadata.js";
import {SocketInjectableNsp} from "../interfaces/SocketInjectableNsp.js";
import {SocketParamMetadata} from "../interfaces/SocketParamMetadata.js";
import {SocketProviderTypes} from "../interfaces/SocketProviderTypes.js";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes.js";
import {SocketProviderMetadata} from "./SocketProviderMetadata.js";
import {SocketSessionData} from "./SocketSessionData.js";

/**
 * @ignore
 */
export class SocketHandlersBuilder {
  private readonly socketProviderMetadata: SocketProviderMetadata;

  constructor(
    private readonly provider: Provider,
    private readonly injector: InjectorService
  ) {
    this.socketProviderMetadata = new SocketProviderMetadata(this.provider.store.get("socketIO"));
  }

  /**
   *
   * @param {SocketHandlerMetadata} handlerMetadata
   * @param scope
   * @returns {(data) => void}
   */
  private static bindResponseMiddleware(handlerMetadata: SocketHandlerMetadata, scope: any) {
    const {returns} = handlerMetadata;

    return (response: any): void => {
      if (returns) {
        switch (returns.type) {
          case SocketReturnsTypes.BROADCAST:
            scope.nsp.emit(returns.eventName, response);
            break;
          case SocketReturnsTypes.BROADCAST_OTHERS:
            scope.socket.broadcast.emit(returns.eventName, response);
            break;
          case SocketReturnsTypes.EMIT:
            scope.socket.emit(returns.eventName, response);
            break;
        }
      } else {
        const cb = scope.args.at(-1);
        if (cb && isFunction(cb)) {
          cb(response);
        }
      }
    };
  }

  /**
   *
   * @returns {any}
   */
  public build(nsps: Map<string | RegExp, Namespace>) {
    const instance = this.injector.get(this.provider.token);
    const {injectNamespaces, namespace} = this.socketProviderMetadata;
    const nsp = nsps.get(namespace);

    instance.$onConnection && this.socketProviderMetadata.createHook("$onConnection", "connection");
    instance.$onDisconnect && this.socketProviderMetadata.createHook("$onDisconnect", "disconnect");

    injectNamespaces.forEach((setting: SocketInjectableNsp) => {
      instance[setting.propertyKey] = nsps.get(setting.nsp || namespace);
    });

    instance["nsp"] = nsp;

    if (instance.$onNamespaceInit) {
      instance.$onNamespaceInit(nsp);
    }

    return this;
  }

  /**
   *
   * @param {Socket} socket
   * @param {Namespace} nsp
   */
  public async onConnection(socket: Socket, nsp: Namespace) {
    const {socketProviderMetadata} = this;
    const instance = this.injector.get(this.provider.token);

    this.buildHandlers(socket, nsp);

    if (instance.$onConnection) {
      const ctx = this.createContext(socket, nsp);
      await runInContext(ctx, () => this.invoke(instance, socketProviderMetadata.$onConnection, {socket, nsp}), this.injector);
    }
  }

  public async onDisconnect(socket: Socket, nsp: Namespace, reason?: string) {
    const instance = this.injector.get(this.provider.token);
    const {socketProviderMetadata} = this;

    if (instance.$onDisconnect) {
      const ctx = this.createContext(socket, nsp);
      await runInContext(ctx, () => this.invoke(instance, socketProviderMetadata.$onDisconnect, {socket, nsp, reason}), this.injector);
    }
  }

  private buildHandlers(socket: Socket, nsp: Namespace) {
    const {socketProviderMetadata} = this;

    socketProviderMetadata.getHandlers().forEach((handler) => {
      const {eventName} = handler;

      if (eventName) {
        socket.on(eventName, async (...args) => {
          const ctx = this.createContext(socket, nsp);
          await runInContext(ctx, () => this.runQueue(handler, args, socket, nsp), this.injector);
        });
      }
    });
  }

  private runQueue(handlerMetadata: SocketHandlerMetadata, args: any[], socket: Socket, nsp: Namespace) {
    const instance = this.injector.get(this.provider.token);
    const {useBefore, useAfter} = this.socketProviderMetadata;
    const scope = {
      args,
      socket,
      nsp,
      eventName: handlerMetadata.eventName
    };

    let promise = Promise.resolve().then(() => this.deserialize(handlerMetadata, scope));

    if (useBefore) {
      useBefore.forEach((target: any) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    if (handlerMetadata.useBefore) {
      handlerMetadata.useBefore.forEach((target) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    promise = promise
      .then(() => this.invoke(instance, handlerMetadata, scope))
      .then(SocketHandlersBuilder.bindResponseMiddleware(handlerMetadata, scope));

    if (handlerMetadata.useAfter) {
      handlerMetadata.useAfter.forEach((target) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    if (useAfter) {
      useAfter.forEach((target: any) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    return promise.catch((er: any) => {
      /* istanbul ignore next */
      $log.error(handlerMetadata.eventName, er);
    });
  }

  private deserialize(handlerMetadata: SocketHandlerMetadata, scope: any) {
    const {parameters} = handlerMetadata;
    Object.keys(parameters || []).forEach((index: any) => {
      const {filter, useMapper, mapIndex, type, collectionType} = parameters![index];
      let value = scope.args[mapIndex!];

      if (filter === SocketFilters.ARGS) {
        if (useMapper && typeof value !== "function") {
          value = deserialize(value, {
            type,
            collectionType,
            useAlias: true
          });
        }
        scope.args[mapIndex!] = value;
      }
    });
  }

  private bindMiddleware(target: any, scope: any, promise: Promise<any>): Promise<any> {
    const instance = this.injector.get(target);

    if (instance) {
      const handlerMetadata: SocketProviderMetadata = new SocketProviderMetadata(Store.from(instance).get("socketIO"));

      if (handlerMetadata.type === SocketProviderTypes.MIDDLEWARE) {
        if (handlerMetadata.error) {
          return promise.catch((error: any) => this.invoke(instance, handlerMetadata.useHandler, {error, ...scope}));
        }

        return promise
          .then(() => this.invoke(instance, handlerMetadata.useHandler, scope))
          .then((result: any) => {
            if (result) {
              scope.args = [].concat(result);
            }
          });
      }
    }

    return promise;
  }

  private invoke(instance: any, handlerMetadata: SocketHandlerMetadata, scope: any): Promise<any> {
    const {methodClassName, parameters} = handlerMetadata;

    return instance[methodClassName](...this.buildParameters(parameters!, scope));
  }

  private buildParameters(parameters: {[key: number]: SocketParamMetadata}, scope: any): any[] {
    return Object.keys(parameters || []).map((index: any) => {
      const param: SocketParamMetadata = parameters[index];

      switch (param.filter) {
        case SocketFilters.ARGS:
          if (param.mapIndex !== undefined) {
            return scope.args[param.mapIndex];
          }

          return scope.args;

        case SocketFilters.EVENT_NAME:
          return scope.eventName;

        case SocketFilters.SOCKET:
          return scope.socket;

        case SocketFilters.NSP:
          return scope.nsp;

        case SocketFilters.ERR:
          return scope.error;

        case SocketFilters.SESSION:
          return new SocketSessionData(scope.socket.data);

        case SocketFilters.RAW_SESSION:
          return scope.socket.data;

        case SocketFilters.SOCKET_NSP:
          return scope.socket.nsp;

        case SocketFilters.REASON:
          return scope.reason;
      }
    });
  }

  private createContext(socket: Socket, nsp: Namespace): DIContext {
    return new DIContext({
      injector: this.injector,
      id: v4().split("-").join(""),
      logger: this.injector.logger,
      additionalProps: {
        module: "socket.io",
        sid: socket.id,
        namespace: nsp.name
      }
    });
  }
}
