import * as SocketIO from "socket.io";
import {$log} from "ts-log-debug";
import {Store} from "../../core";
import {ProviderStorable} from "../../di/class/ProviderStorable";
import {ISocketHandlerMetadata} from "../interfaces/ISocketHandlerMetadata";
import {ISocketParamMetadata} from "../interfaces/ISocketParamMetadata";
import {ISocketProviderMetadata} from "../interfaces/ISocketProviderMetadata";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";

/**
 * @experimental
 */
export class SocketHandlersBuilder {
    private socketProviderMetadata: ISocketProviderMetadata;

    constructor(private provider: ProviderStorable<any>) {
        this.socketProviderMetadata = this.provider.store.get("socketIO");
    }

    /**
     *
     * @returns {any}
     */
    public build(nsp: SocketIO.Namespace) {
        const {instance} = this.provider;

        if (instance.$onDisconnect) {
            const handler = this.socketProviderMetadata.handlers["$onDisconnect"] || {};
            handler.eventName = "disconnect";
            handler.methodClassName = "$onDisconnect";

            this.socketProviderMetadata.handlers["$onDisconnect"] = handler;
        }

        nsp.on("connection", (socket) => this.onConnection(socket, nsp));

        instance._nspSession = new Map();
        instance[this.socketProviderMetadata.injectNamespace || "nsp"] = nsp;

        if (instance.$onNamespaceInit) {
            instance.$onNamespaceInit(nsp);
        }
    }

    /**
     *
     * @param {SocketIO.Socket} socket
     * @param {SocketIO.Namespace} nsp
     */
    private onConnection(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {
        const {instance} = this.provider;

        this.buildHandlers(socket, nsp);
        this.createSession(socket);

        socket.on("disconnect", () => {
            this.destroySession(socket);
        });

        if (instance.$onConnection) {
            const config = this.socketProviderMetadata.handlers.$onConnection;
            config.methodClassName = "$onConnection";

            this.invoke(config, [], socket, nsp);
        }
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
        Object
            .keys(this.socketProviderMetadata.handlers)
            .filter(key => key !== "$onConnection")
            .forEach((propertyKey: string) => {

                const handlerMetadata: ISocketHandlerMetadata = this.socketProviderMetadata.handlers[propertyKey];
                const eventName = handlerMetadata.eventName;

                socket.on(eventName, (...parameters: any[]) => {
                    this.invoke(handlerMetadata, parameters, socket, nsp);
                });
            });
    }

    /**
     *
     * @returns {Promise<any>}
     * @param handlerMetadata
     * @param args
     * @param socket
     * @param nsp
     */
    private async invoke(handlerMetadata: ISocketHandlerMetadata, args: any[], socket: SocketIO.Socket, nsp: SocketIO.Namespace): Promise<void> {

        try {
            const {instance} = this.provider;
            const {methodClassName, returns} = handlerMetadata;
            const scope: any = {args, socket, nsp};
            const parameters = this.buildParameters(handlerMetadata.parameters, scope);


            const result = await instance[methodClassName](...parameters);

            if (returns) {
                SocketHandlersBuilder.sendResponse(returns.eventName, returns.type, result, scope);
            }
        } catch (er) {
            /* istanbul ignore next */
            $log.error(handlerMetadata.eventName, er);
            /* istanbul ignore next */
            process.exit(-1);
        }

    }

    /**
     *
     * @param parameters
     * @param scope
     * @returns {any[]}
     */
    private buildParameters(parameters: { [key: number ]: ISocketParamMetadata }, scope: any): any[] {
        const store = Store.from(this.provider.instance);
        return Object
            .keys(parameters || [])
            .map(
                (index: any) => {
                    const param: ISocketParamMetadata = parameters[index];

                    switch (param.filter) {
                        case SocketFilters.ARGS:

                            if (param.mapIndex !== undefined) {
                                return scope.args[param.mapIndex];
                            }

                            return scope.args;

                        case SocketFilters.SOCKET :
                            return scope.socket;

                        case SocketFilters.NSP:
                            return scope.nsp;

                        case SocketFilters.SESSION :
                            return this.provider.instance._nspSession.get(scope.socket.id);
                    }
                }
            );
    }

    /**
     *
     * @param {string} eventName
     * @param {SocketReturnsTypes} type
     * @param response
     * @param scope
     */
    private static sendResponse(eventName: string, type: SocketReturnsTypes, response: any, scope: any) {
        switch (type) {
            case SocketReturnsTypes.BROADCAST:
                scope.nsp.emit(eventName, response);
                break;
            case SocketReturnsTypes.BROADCAST_OTHERS:
                scope.socket.broadcast.emit(eventName, response);
                break;
            case SocketReturnsTypes.EMIT:
                scope.socket.emit(eventName, response);
                break;
        }
    }
}


