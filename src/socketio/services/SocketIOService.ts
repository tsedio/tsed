import {
    HttpServer,
    HttpsServer,
    Inject,
    OnServerReady,
    ProviderRegistry,
    ProviderStorable,
    ServerSettingsService,
    Service
} from "@tsed/common";
import {nameOf} from "@tsed/core";
import * as SocketIO from "socket.io";
import {$log} from "ts-log-debug";
import {IO} from "../";
import {SocketHandlersBuilder} from "../class/SocketHandlersBuilder";
import {ISocketProviderMetadata} from "../interfaces/ISocketProviderMetadata";

/**
 *
 */
@Service()
export class SocketIOService implements OnServerReady {
    /**
     *
     * @type {Map<any, any>}
     */
    private namespaces: Map<string, { nsp: SocketIO.Namespace, instances: any }> = new Map();

    constructor(@Inject(HttpServer) private httpServer: HttpServer,
                @Inject(HttpsServer) private httpsServer: HttpsServer,
                @IO private io: SocketIO.Server,
                private serverSettingsService: ServerSettingsService) {

    }

    $onServerReady() {
        const config: SocketIO.ServerOptions = this.serverSettingsService.get("socketIO") || {};
        const httpPort = this.serverSettingsService.httpPort;
        const httpsPort = this.serverSettingsService.httpsPort;

        if (httpPort) {
            this.io.attach(this.httpServer.get(), config);
        }
        if (httpsPort) {
            this.io.attach(this.httpsServer.get(), config);
        }

        if (config.adapter) {
            this.io.adapter(config.adapter);
        }

        this.getWebsocketServices().forEach(provider => this.bindProvider(provider));

        this.printSocketEvents();
    }

    /**
     *
     * @returns {ProviderStorable<any>[]}
     */
    public getWebsocketServices(): ProviderStorable<any>[] {
        const websockets: ProviderStorable<any>[] = [];

        ProviderRegistry.forEach((provider) => {
            if (provider.store.has("socketIO") && provider.store.get("socketIO").namespace !== undefined) {
                websockets.push(provider);
            }
        });

        return websockets;
    }

    /**
     *
     * @param {string} namespace
     * @returns {SocketIO.Namespace}
     */
    public getNsp(namespace: string = "/"): { nsp: SocketIO.Namespace, instances: any[] } {
        if (!this.namespaces.has(namespace)) {
            const conf = {nsp: this.io.of(namespace), instances: []};

            this.namespaces.set(namespace, conf);

            conf.nsp.on("connection", (socket) => {
                conf.instances.forEach((builder: SocketHandlersBuilder) => {
                    builder.onConnection(socket, conf.nsp);
                });

                socket.on("disconnect", () => {
                    conf.instances.forEach((builder: SocketHandlersBuilder) => {
                        builder.onDisconnect(socket, conf.nsp);
                    });
                });
            });
        }

        return this.namespaces.get(namespace)!;
    }

    /**
     *
     * @param {ProviderStorable<any>} provider
     */
    private bindProvider(provider: ProviderStorable<any>) {
        const wsConfig: ISocketProviderMetadata = provider.store.get("socketIO")!;

        const nspConfig = this.getNsp(wsConfig.namespace);
        const builder = new SocketHandlersBuilder(provider).build(nspConfig.nsp);

        nspConfig.instances.push(builder);
    }

    /**
     *
     * @param logger
     */
    private printSocketEvents(logger: { info: (s: any) => void } = $log) {
        const list = this
            .getWebsocketServices()
            .reduce((acc: any[], provider) => {
                const {handlers, namespace}: ISocketProviderMetadata = provider.store.get("socketIO");

                if (namespace) {
                    Object.keys(handlers)
                        .filter(key => ["$onConnection", "$onDisconnect"].indexOf(key) === -1)
                        .forEach((key: string) => {
                            const handler = handlers[key];
                            acc.push({
                                namespace,
                                inputEvent: handler.eventName,
                                outputEvent: handler.returns && handler.returns.eventName || "",
                                outputType: handler.returns && handler.returns.type || "",
                                name: `${nameOf(provider.useClass)}.${handler.methodClassName}`
                            });
                        });
                }

                return acc;
            }, []);

        $log.info("Socket events mounted:");

        let str = $log.drawTable(list, {
            padding: 1,
            header: {
                namespace: "Namespace",
                inputEvent: "Input event",
                outputEvent: "Output event",
                outputType: "Output type",
                name: "Class method"
            }
        });

        logger.info("\n" + str.trim());

        $log.info("Socket server started...");
    }
}