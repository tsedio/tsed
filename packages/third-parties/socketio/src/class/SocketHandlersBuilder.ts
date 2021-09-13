import {ConverterService, InjectorService, Provider} from "@tsed/common";
import {Store} from "@tsed/core";
import {$log} from "@tsed/logger";
import {Namespace, Socket} from "socket.io";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketHandlerMetadata} from "../interfaces/SocketHandlerMetadata";
import {SocketInjectableNsp} from "../interfaces/SocketInjectableNsp";
import {SocketParamMetadata} from "../interfaces/SocketParamMetadata";
import {SocketProviderTypes} from "../interfaces/SocketProviderTypes";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";
import {getNspSession} from "../registries/NspSessionRegistry";
import {SocketProviderMetadata} from "./SocketProviderMetadata";

/**
 * @ignore
 */
export class SocketHandlersBuilder {
  private socketProviderMetadata: SocketProviderMetadata;

  constructor(private provider: Provider<any>, private converterService: ConverterService, private injector: InjectorService) {
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
      }
    };
  }

  /**
   *
   * @returns {any}
   */
  public build(nsps: Map<string, Namespace>) {
    const {instance} = this.provider;
    const {injectNamespaces, namespace} = this.socketProviderMetadata;
    const nsp = nsps.get(namespace);

    instance.$onConnection && this.socketProviderMetadata.createHook("$onConnection", "connection");
    instance.$onDisconnect && this.socketProviderMetadata.createHook("$onDisconnect", "disconnect");

    instance._nspSession = getNspSession(namespace);

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
  public onConnection(socket: Socket, nsp: Namespace) {
    const {socketProviderMetadata} = this;
    const {instance} = this.provider;

    this.buildHandlers(socket, nsp);
    this.createSession(socket);

    if (instance.$onConnection) {
      this.invoke(instance, socketProviderMetadata.$onConnection, {socket, nsp});
    }
  }

  public onDisconnect(socket: Socket, nsp: Namespace) {
    const {instance} = this.provider;
    const {socketProviderMetadata} = this;

    if (instance.$onDisconnect) {
      this.invoke(instance, socketProviderMetadata.$onDisconnect, {socket, nsp});
    }

    this.destroySession(socket);
  }

  /**
   *
   * @param {Socket} socket
   */
  private createSession(socket: Socket) {
    this.provider.instance._nspSession.set(socket.id, new Map());
  }

  /**
   *
   * @param {Socket} socket
   */
  private destroySession(socket: Socket) {
    this.provider.instance._nspSession.delete(socket.id);
  }

  private buildHandlers(socket: Socket, nsp: Namespace) {
    const {socketProviderMetadata} = this;

    socketProviderMetadata.getHandlers().forEach((handler) => {
      const {eventName} = handler;

      if (eventName) {
        socket.on(eventName, (...args) => {
          this.runQueue(handler, args, socket, nsp);
        });
      }
    });
  }

  private async runQueue(handlerMetadata: SocketHandlerMetadata, args: any[], socket: Socket, nsp: Namespace) {
    let promise: any = Promise.resolve(args);
    const {useBefore, useAfter} = this.socketProviderMetadata;
    const scope = {
      args,
      socket,
      nsp,
      eventName: handlerMetadata.eventName
    };

    promise = promise.then(() => this.deserialize(handlerMetadata, scope));

    if (useBefore) {
      useBefore.forEach((target: any) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    if (handlerMetadata.useBefore) {
      handlerMetadata.useBefore.forEach((target) => (promise = this.bindMiddleware(target, scope, promise)));
    }

    promise = promise
      .then(() => this.invoke(this.provider.instance, handlerMetadata, scope))
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
      /* istanbul ignore next */
      process.exit(-1);
    });
  }

  private deserialize(handlerMetadata: SocketHandlerMetadata, scope: any) {
    const {parameters} = handlerMetadata;
    Object.keys(parameters || []).forEach((index: any) => {
      const {filter, useConverter, mapIndex, type, collectionType} = parameters![index];
      let value = scope.args[mapIndex!];

      if (filter === SocketFilters.ARGS && useConverter) {
        value = this.converterService.deserialize(value, {type, collectionType});
        scope.args[mapIndex!] = value;
      }
    });
  }

  private bindMiddleware(target: any, scope: any, promise: Promise<any>): Promise<any> {
    const provider = this.injector.getProvider(target);

    if (provider) {
      const instance = provider.instance;
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

  private async invoke(instance: any, handlerMetadata: SocketHandlerMetadata, scope: any): Promise<any> {
    const {methodClassName, parameters} = handlerMetadata;

    return await instance[methodClassName](...this.buildParameters(parameters!, scope));
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
          return this.provider.instance._nspSession.get(scope.socket.id);
      }
    });
  }
}
