import {ConverterService, InjectorService, Provider} from "@tsed/common";
import {Store} from "@tsed/core";
import * as SocketIO from "socket.io"; // tslint:disable-line: no-unused-variable
import {$log} from "ts-log-debug";
import {ISocketHandlerMetadata} from "../interfaces/ISocketHandlerMetadata";
import {ISocketParamMetadata} from "../interfaces/ISocketParamMetadata";
import {ISocketProviderMetadata, SocketProviderTypes} from "../interfaces/ISocketProviderMetadata";

import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";
import {getNspSession} from "../registries/NspSessionRegistry";

/**
 * @experimental
 */
export class SocketHandlersBuilder {
  private socketProviderMetadata: ISocketProviderMetadata;

  constructor(private provider: Provider<any>, private converterService: ConverterService, private injector: InjectorService) {
    this.socketProviderMetadata = this.provider.store.get("socketIO");
  }

  /**
   *
   * @returns {any}
   */
  public build(nsps: Map<string, SocketIO.Namespace>) {
    const {instance} = this.provider;
    const {injectNamespaces = [], namespace = "/"} = this.socketProviderMetadata;

    const nsp = nsps.get(namespace);

    if (instance.$onConnection) {
      this.buildHook("$onConnection", "connection");
    }

    if (instance.$onDisconnect) {
      this.buildHook("$onDisconnect", "disconnect");
    }

    instance._nspSession = getNspSession(namespace!);

    injectNamespaces.forEach(setting => {
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
   * @param {string} hook
   * @param {string} eventName
   */
  private buildHook(hook: string, eventName: string) {
    const handlers = this.socketProviderMetadata.handlers || {};

    handlers[hook] = Object.assign(handlers[hook] || {}, {
      eventName,
      methodClassName: hook
    });

    this.socketProviderMetadata.handlers = handlers;
  }

  /**
   *
   * @param {SocketIO.Socket} socket
   * @param {SocketIO.Namespace} nsp
   */
  public onConnection(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {
    const {instance} = this.provider;

    this.buildHandlers(socket, nsp);
    this.createSession(socket);

    if (instance.$onConnection) {
      this.invoke(instance, this.socketProviderMetadata.handlers.$onConnection, {socket, nsp});
    }
  }

  public onDisconnect(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {
    const {instance} = this.provider;

    if (instance.$onDisconnect) {
      this.invoke(instance, this.socketProviderMetadata.handlers.$onDisconnect, {socket, nsp});
    }

    this.destroySession(socket);
  }

  /**
   *
   * @param {SocketIO.Socket} socket
   */
  private createSession(socket: SocketIO.Socket) {
    this.provider.instance._nspSession.set(socket.id, new Map());
  }

  /**
   *
   * @param {SocketIO.Socket} socket
   */
  private destroySession(socket: SocketIO.Socket) {
    this.provider.instance._nspSession.delete(socket.id);
  }

  /**
   *
   * @param {SocketIO.Socket} socket
   * @param {SocketIO.Namespace} nsp
   */
  private buildHandlers(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {
    Object.keys(this.socketProviderMetadata.handlers)
      .filter(key => ["$onConnection", "$onDisconnect"].indexOf(key) === -1)
      .forEach((propertyKey: string) => {
        const handlerMetadata: ISocketHandlerMetadata = this.socketProviderMetadata.handlers[propertyKey];
        const eventName: string = handlerMetadata.eventName!;

        if (eventName) {
          socket.on(eventName, (...args) => {
            this.runQueue(handlerMetadata, args, socket, nsp);
          });
        }
      });
  }

  /**
   *
   * @param {ISocketHandlerMetadata} handlerMetadata
   * @param args
   * @param {SocketIO.Socket} socket
   * @param {SocketIO.Namespace} nsp
   * @returns {(parameters) => Promise<void>}
   */
  private async runQueue(handlerMetadata: ISocketHandlerMetadata, args: any[], socket: SocketIO.Socket, nsp: SocketIO.Namespace) {
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
      useBefore.forEach(target => (promise = this.bindMiddleware(target, scope, promise)));
    }

    if (handlerMetadata.useBefore) {
      handlerMetadata.useBefore.forEach(target => (promise = this.bindMiddleware(target, scope, promise)));
    }

    promise = promise
      .then(() => this.invoke(this.provider.instance, handlerMetadata, scope))
      .then(SocketHandlersBuilder.bindResponseMiddleware(handlerMetadata, scope));

    if (handlerMetadata.useAfter) {
      handlerMetadata.useAfter.forEach(target => (promise = this.bindMiddleware(target, scope, promise)));
    }

    if (useAfter) {
      useAfter.forEach(target => (promise = this.bindMiddleware(target, scope, promise)));
    }

    return promise.catch((er: any) => {
      /* istanbul ignore next */
      $log.error(handlerMetadata.eventName, er);
      /* istanbul ignore next */
      process.exit(-1);
    });
  }

  /**
   *
   * @param {ISocketHandlerMetadata} handlerMetadata
   * @param scope
   */
  private deserialize(handlerMetadata: ISocketHandlerMetadata, scope: any) {
    const {parameters} = handlerMetadata;
    Object.keys(parameters || []).forEach((index: any) => {
      const {filter, useConverter, mapIndex, type, collectionType} = parameters![index];
      let value = scope.args[mapIndex!];

      if (filter === SocketFilters.ARGS && useConverter) {
        value = this.converterService.deserialize(value, type, collectionType);
        scope.args[mapIndex!] = value;
      }
    });
  }

  /**
   *
   * @param {ISocketHandlerMetadata} handlerMetadata
   * @param scope
   * @returns {(data) => void}
   */
  private static bindResponseMiddleware(handlerMetadata: ISocketHandlerMetadata, scope: any) {
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
   * @param target
   * @param scope
   * @param promise
   * @returns {(args: any[]) => Promise<any[]>}
   */
  private bindMiddleware(target: any, scope: any, promise: Promise<any>): Promise<any> {
    const provider = this.injector.getProvider(target);

    if (provider) {
      const instance = provider.instance;
      const handlerMetadata: ISocketProviderMetadata = Store.from(instance).get("socketIO");

      if (handlerMetadata.type === SocketProviderTypes.MIDDLEWARE) {
        if (handlerMetadata.error) {
          return promise.catch((error: any) => this.invoke(instance, handlerMetadata.handlers.use, {error, ...scope}));
        }

        return promise
          .then(() => this.invoke(instance, handlerMetadata.handlers.use, scope))
          .then((result: any) => {
            if (result) {
              scope.args = [].concat(result);
            }
          });
      }
    }

    return promise;
  }

  /**
   *
   * @returns {Promise<any>}
   * @param instance
   * @param handlerMetadata
   * @param scope
   */
  private async invoke(instance: any, handlerMetadata: ISocketHandlerMetadata, scope: any): Promise<any> {
    const {methodClassName, parameters} = handlerMetadata;

    return await instance[methodClassName](...this.buildParameters(parameters!, scope));
  }

  /**
   *
   * @param parameters
   * @param scope
   * @returns {any[]}
   */
  private buildParameters(parameters: {[key: number]: ISocketParamMetadata}, scope: any): any[] {
    return Object.keys(parameters || []).map((index: any) => {
      const param: ISocketParamMetadata = parameters[index];

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
