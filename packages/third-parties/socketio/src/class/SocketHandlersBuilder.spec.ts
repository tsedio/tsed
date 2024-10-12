import {Store} from "@tsed/core";
import {DIContext, getContext, InjectorService, ProviderType} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {SocketFilters} from "../interfaces/SocketFilters.js";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes.js";
import {SocketHandlersBuilder} from "./SocketHandlersBuilder.js";
import {SocketProviderMetadata} from "./SocketProviderMetadata.js";

const metadata: any = {
  handlers: {
    testHandler: {
      methodClassName: "testHandler",
      eventName: "eventName",
      parameters: ["param"],
      returns: {
        eventName: "returnEventName",
        type: "type"
      }
    }
  }
};

describe("SocketHandlersBuilder", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("build()", () => {
    function createServiceFixture() {
      const instance: any = {
        $onDisconnect: vi.fn(),
        $onConnection: vi.fn(),
        $onNamespaceInit: vi.fn()
      };

      const provider: any = {
        store: {
          get: vi.fn()
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);
      builder.socketProviderMetadata = new SocketProviderMetadata({
        namespace: "/",
        injectNamespaces: [{propertyKey: "key1"}, {propertyKey: "key2", nsp: "/test"}],
        handlers: {
          $onDisconnect: {} as any
        }
      });

      const nsps = new Map();
      nsps.set("/", "namespace1");
      nsps.set("/test", "namespace2");

      builder.build(nsps);

      return {builder, nsps, provider, instance};
    }

    it("should create metadata when $onDisconnect exists", () => {
      const {builder} = createServiceFixture();
      expect(builder.socketProviderMetadata).toEqual(
        new SocketProviderMetadata({
          namespace: "/",
          handlers: {
            $onConnection: {
              eventName: "connection",
              methodClassName: "$onConnection"
            },
            $onDisconnect: {
              eventName: "disconnect",
              methodClassName: "$onDisconnect"
            }
          },
          injectNamespaces: [
            {
              propertyKey: "key1"
            },
            {
              nsp: "/test",
              propertyKey: "key2"
            }
          ]
        })
      );
    });
    it("should call $onNamespaceInit hook", () => {
      const {instance} = createServiceFixture();
      expect(instance.$onNamespaceInit).toHaveBeenCalledWith("namespace1");
    });
    it("should add namespace1", () => {
      const {instance} = createServiceFixture();
      expect(instance.key1).toEqual("namespace1");
    });
    it("should add namespace2", () => {
      const {instance} = createServiceFixture();
      expect(instance.key2).toEqual("namespace2");
    });

    it("should add default nsp", () => {
      const {instance} = createServiceFixture();
      expect(instance.nsp).toEqual("namespace1");
    });
  });
  describe("onConnection()", () => {
    it("should build handler and invoke onConnection instance method", async () => {
      const instance = {
        $onConnection: vi.fn()
      };
      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue({
            injectNamespaces: [{nsp: "/nsp", propertyKey: "key"}],
            handlers: {
              $onConnection: {
                eventName: "connection",
                methodClassName: "$onConnection"
              } as any
            }
          })
        }
      };
      const nspStub = {nsp: "nsp"};
      const socketStub = {
        on: vi.fn()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);

      const invokeStub = vi.spyOn(builder, "invoke").mockReturnValue(undefined);
      const buildHandlersStub = vi.spyOn(builder, "buildHandlers").mockReturnValue(undefined);

      await builder.onConnection(socketStub, nspStub);

      expect(buildHandlersStub).toHaveBeenCalledWith(socketStub, nspStub);
      expect(invokeStub).toHaveBeenCalledWith(
        instance,
        {eventName: "connection", methodClassName: "$onConnection"},
        {
          socket: socketStub,
          nsp: nspStub
        }
      );
    });

    it("should call the $onConnection in the context", async () => {
      let ctx!: DIContext;

      const instance = {
        $onConnection: vi.fn().mockImplementation(() => {
          ctx = getContext()!;
        })
      };

      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue({
            injectNamespace: "nsp",
            handlers: {
              $onConnection: {
                eventName: "connection",
                methodClassName: "$onConnection"
              }
            }
          })
        }
      };
      const nspStub: any = {nsp: "nsp", name: "nsp"};
      const socketStub: any = {
        id: "id",
        on: vi.fn()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);

      await builder.onConnection(socketStub, nspStub);

      expect(ctx).toMatchObject({
        id: expect.any(String)
      });
    });
  });
  describe("onDisconnect()", () => {
    it("should create the $onDisconnect method if is missing", async () => {
      const instance = {
        $onDisconnect: vi.fn()
      };

      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue({
            injectNamespace: "nsp",
            handlers: {
              $onDisconnect: {
                eventName: "disconnect",
                methodClassName: "$onDisconnect"
              }
            }
          })
        }
      };
      const nspStub: any = {nsp: "nsp"};
      const socketStub: any = {
        on: vi.fn()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);
      const invokeStub = vi.spyOn(builder, "invoke").mockReturnValue(undefined);

      await builder.onDisconnect(socketStub, nspStub);

      expect(invokeStub).toHaveBeenCalledWith(
        instance,
        {eventName: "disconnect", methodClassName: "$onDisconnect"},
        {
          socket: socketStub,
          nsp: nspStub
        }
      );
    });

    it("should pass the disconnection reason", async () => {
      const instance = {
        $onDisconnect: vi.fn()
      };

      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue({
            injectNamespace: "nsp",
            handlers: {
              $onDisconnect: {
                eventName: "disconnect",
                methodClassName: "$onDisconnect"
              }
            }
          })
        }
      };
      const nspStub: any = {nsp: "nsp"};
      const reason = "transport error";
      const socketStub: any = {
        on: vi.fn()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);
      const invokeStub = vi.spyOn(builder, "invoke").mockReturnValue(undefined);

      await builder.onDisconnect(socketStub, nspStub, reason);

      expect(invokeStub).toHaveBeenCalledWith(
        instance,
        {eventName: "disconnect", methodClassName: "$onDisconnect"},
        {
          reason,
          socket: socketStub,
          nsp: nspStub
        }
      );
    });

    it("should call the $onDisconnect in the context", async () => {
      let ctx!: DIContext;

      const instance = {
        $onDisconnect: vi.fn().mockImplementation(() => {
          ctx = getContext()!;
        })
      };

      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue({
            injectNamespace: "nsp",
            handlers: {
              $onDisconnect: {
                eventName: "disconnect",
                methodClassName: "$onDisconnect"
              }
            }
          })
        }
      };
      const nspStub: any = {nsp: "nsp", name: "nsp"};
      const socketStub: any = {
        id: "id",
        on: vi.fn()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);

      await builder.onDisconnect(socketStub, nspStub);

      expect(ctx).toMatchObject({
        id: expect.any(String)
      });
    });
  });

  describe("buildHandlers()", () => {
    it("should call socket.on() method", async () => {
      const metadata = {
        handlers: {
          testHandler: {
            eventName: "eventName"
          }
        }
      };
      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue(metadata)
        }
      };
      const socketStub = {
        on: vi.fn().mockImplementation((_, fn) => fn("arg1"))
      };
      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        }
      } as any);
      vi.spyOn(builder, "runQueue").mockResolvedValue(undefined);

      await builder.buildHandlers(socketStub, "ws");

      expect(socketStub.on).toHaveBeenCalledWith("eventName", expect.any(Function));
      expect(builder.runQueue).toHaveBeenCalledWith(metadata.handlers.testHandler, ["arg1"], socketStub, "ws");
    });

    it("should call the method instance in the context", async () => {
      const metadata = {
        handlers: {
          testHandler: {
            eventName: "eventName",
            methodClassName: "testHandler"
          }
        }
      };
      let ctx!: DIContext;
      const instance = {
        testHandler: vi.fn().mockImplementation(() => {
          ctx = getContext()!;
        })
      };
      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue(metadata)
        }
      };
      let promise!: Promise<unknown>;
      const socketStub = {
        on: vi.fn().mockImplementation((_, fn) => (promise = fn("arg1")))
      };
      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);

      await builder.buildHandlers(socketStub, "ws");
      await promise;

      expect(ctx).toMatchObject({
        id: expect.any(String)
      });
    });
  });
  describe("invoke()", () => {
    it("should call the method instance", () => {
      const instance = {
        testHandler: vi.fn().mockReturnValue("response")
      };
      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue(metadata)
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);
      const buildParametersStub = vi.spyOn(builder, "buildParameters").mockReturnValue(["argMapped"]);

      builder.invoke(instance, metadata.handlers.testHandler, {scope: "scope"});

      expect(buildParametersStub).toHaveBeenCalledWith(["param"], {
        scope: "scope"
      });

      expect(instance.testHandler).toHaveBeenCalledWith("argMapped");
    });
  });
  describe("buildParameters()", () => {
    function createFixture() {
      const instance: any = {
        testHandler: vi.fn().mockReturnValue("response")
      };
      const provider: any = {
        store: {
          get: vi.fn().mockReturnValue(metadata)
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        alterAsync(_event: any, fn: any, _ctx: any) {
          return fn;
        },
        get() {
          return instance;
        }
      } as any);

      return {
        instance,
        builder,
        provider
      };
    }

    describe("when ARGS", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ARGS
            }
          },
          {args: ["mapValue"]}
        );

        expect(result).toEqual([["mapValue"]]);
      });
    });

    describe("when ARGS with mapIndex", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ARGS,
              mapIndex: 0
            }
          },
          {args: ["mapValue"]}
        );

        expect(result).toEqual(["mapValue"]);
      });
    });

    describe("when Socket", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SOCKET
            }
          },
          {socket: "socket"}
        );

        expect(result).toEqual(["socket"]);
      });
    });

    describe("when NSP", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.NSP
            }
          },
          {nsp: "nsp"}
        );

        expect(result).toEqual(["nsp"]);
      });
    });

    describe("when REASON", () => {
      it("should return a disconnect reason", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.REASON
            }
          },
          {reason: "transport error"}
        );

        expect(result).toEqual(["transport error"]);
      });
    });

    describe("when ERROR", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ERR
            }
          },
          {error: "error"}
        );

        expect(result).toEqual(["error"]);
      });
    });

    describe("when EVENT_NAME", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();
        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.EVENT_NAME
            }
          },
          {eventName: "eventName"}
        );

        expect(result).toEqual(["eventName"]);
      });
    });

    describe("when SESSION", () => {
      it("should return a list of parameters", () => {
        const data = {id: "id"};

        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SESSION
            }
          },
          {socket: {data, id: "id"}}
        );

        expect(new Map(result[0])).toEqual(new Map(Object.entries(data)));
      });
    });

    describe("when RAW_SESSION", () => {
      it("should return a list of parameters", () => {
        const data = {id: "id"};

        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.RAW_SESSION
            }
          },
          {socket: {data, id: "id"}}
        );

        expect(result[0]).toEqual(data);
      });
    });

    describe("when SOCKET_NSP", () => {
      it("should return a list of parameters", () => {
        const {builder} = createFixture();

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SOCKET_NSP
            }
          },
          {socket: {nsp: "socket_nsp"}}
        );

        expect(result).toEqual(["socket_nsp"]);
      });
    });
  });
  describe("bindResponseMiddleware()", () => {
    describe("when BROADCAST", () => {
      it("should call the ws.emit method", () => {
        const nspStub = {
          emit: vi.fn()
        };

        (SocketHandlersBuilder as any).bindResponseMiddleware(
          {
            returns: {
              type: SocketReturnsTypes.BROADCAST,
              eventName: "eventName"
            }
          },
          {nsp: nspStub}
        )({response: "response"});

        expect(nspStub.emit).toHaveBeenCalledWith("eventName", {response: "response"});
      });
    });
    describe("when BROADCAST_OTHERS", () => {
      it("should call the socket.broadcast.emit method", () => {
        const socketStub = {
          broadcast: {
            emit: vi.fn()
          }
        };

        (SocketHandlersBuilder as any).bindResponseMiddleware(
          {
            returns: {
              type: SocketReturnsTypes.BROADCAST_OTHERS,
              eventName: "eventName"
            }
          },
          {socket: socketStub}
        )({response: "response"});

        expect(socketStub.broadcast.emit).toHaveBeenCalledWith("eventName", {response: "response"});
      });
    });

    describe("when EMIT", () => {
      it("should call the socket.emit method", () => {
        const socketStub = {
          emit: vi.fn()
        };

        (SocketHandlersBuilder as any).bindResponseMiddleware(
          {
            returns: {
              type: SocketReturnsTypes.EMIT,
              eventName: "eventName"
            }
          },
          {socket: socketStub}
        )({response: "response"});

        expect(socketStub.emit).toHaveBeenCalledWith("eventName", {response: "response"});
      });
    });
  });
  describe("runQueue()", () => {
    function createServiceFixture() {
      const provider = {
        store: {
          get: vi.fn().mockReturnValue({
            useBefore: [{target: "target before global"}],
            useAfter: [{target: "target after global"}]
          })
        }
      };
      const instance = {instance: "instance"};

      const handlerMetadata = {
        eventName: "eventName",
        useBefore: [{target: "target before"}],
        useAfter: [{target: "target after"}]
      };

      vi.spyOn(SocketHandlersBuilder as any, "bindResponseMiddleware").mockResolvedValue(undefined);

      const builder: any = new SocketHandlersBuilder(
        provider as any,
        {
          get() {
            return instance;
          }
        } as any
      );

      vi.spyOn(builder, "invoke").mockResolvedValue(undefined);
      vi.spyOn(builder, "bindMiddleware").mockResolvedValue(undefined);
      vi.spyOn(builder, "deserialize").mockResolvedValue(undefined);

      return {builder, handlerMetadata, provider, instance};
    }

    it("should call bindMiddleware (handler before global)", async () => {
      const {builder, handlerMetadata, instance} = createServiceFixture();

      await builder.runQueue(handlerMetadata, ["arg1"], "socket", "nsp");

      expect((builder as any).bindMiddleware).toHaveBeenNthCalledWith(
        1,
        {target: "target before global"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        expect.any(Object)
      );

      expect((builder as any).bindMiddleware).toHaveBeenNthCalledWith(
        2,
        {target: "target before"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        expect.any(Object)
      );

      expect(builder.invoke).toHaveBeenCalledWith(instance, handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });

      expect((SocketHandlersBuilder as any).bindResponseMiddleware).toHaveBeenCalledWith(handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });

      expect((builder as any).bindMiddleware).toHaveBeenNthCalledWith(
        3,
        {target: "target after"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        expect.any(Object)
      );

      expect((builder as any).bindMiddleware).toHaveBeenNthCalledWith(
        4,
        {target: "target after global"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        expect.any(Object)
      );

      expect(builder.deserialize).toHaveBeenCalledWith(handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });
  });
  describe("bindMiddleware()", () => {
    describe("middleware is not registered", () => {
      it("should call Middleware.get", () => {
        class Test {}

        const injector = PlatformTest.get(InjectorService);
        const provider: any = {
          token: Test,
          store: {
            get: vi.fn()
          }
        };

        Store.from(Test).set("socketIO", {
          handlers: {
            use: "use"
          }
        });

        vi.spyOn(injector, "getProvider").mockReturnValue(false);
        vi.spyOn(injector, "get").mockReturnValue(undefined);

        const scope = {scope: "scope"};

        const builder: any = new SocketHandlersBuilder(provider, injector);
        vi.spyOn(builder, "invoke");

        builder.bindMiddleware({target: "target"}, scope, Promise.resolve());

        expect(injector.get).toHaveBeenCalledWith({target: "target"});
        expect(builder.invoke).not.toHaveBeenCalled();
      });
    });

    describe("middleware", () => {
      it("should call build handler from metadata", async () => {
        // GIVEN
        class Test {}

        const instance = new Test();
        const provider = {
          token: Test,
          store: {
            get: vi.fn()
          }
        };

        Store.from(Test).set("socketIO", {
          type: ProviderType.MIDDLEWARE,
          handlers: {
            use: "use"
          }
        });
        const scope = {scope: "scope", args: undefined};
        const injector = PlatformTest.get(InjectorService);
        const builder: any = new SocketHandlersBuilder(provider as any, injector);

        vi.spyOn(injector, "getProvider").mockReturnValue({type: ProviderType.MIDDLEWARE});
        vi.spyOn(injector, "get").mockReturnValue(instance);
        vi.spyOn(builder, "invoke").mockReturnValue({result: "result"});

        // WHEN
        await builder.bindMiddleware({target: "target"}, scope, Promise.resolve());

        // THEN
        expect(injector.get).toHaveBeenCalledWith({target: "target"});
        expect(builder.invoke).toHaveBeenCalledWith(instance, "use", scope);
        expect(scope.args).toEqual([{result: "result"}]);
      });
    });

    describe("middleware error", () => {
      it("should call build handler from metadata", async () => {
        class Test {}

        const injector = PlatformTest.get(InjectorService);

        const instance = new Test();
        const provider = {
          store: {
            get: vi.fn()
          }
        };

        Store.from(Test).set("socketIO", {
          type: ProviderType.MIDDLEWARE,
          error: true,
          handlers: {
            use: "use"
          }
        });

        const getProviderStub = vi.spyOn(injector as any, "getProvider");
        const getStub = vi.spyOn(injector as any, "get");
        getProviderStub.mockReturnValue({
          type: ProviderType.MIDDLEWARE
        });
        getStub.mockReturnValue(instance);

        const scope = {scope: "scope", args: undefined};
        const error = new Error("test");
        const builder: any = new SocketHandlersBuilder(provider as any, injector);
        vi.spyOn(builder, "invoke").mockReturnValue({result: "result"});

        // WHEN
        await builder.bindMiddleware({target: "target"}, scope, Promise.reject(error));

        // THEN
        expect(injector.get).toHaveBeenCalledWith({target: "target"});
        expect(builder.invoke).toHaveBeenCalledWith(instance, "use", {error, ...scope});
      });
    });
  });
  describe("deserialize()", () => {
    it("should call deserialize on args", () => {
      const provider: any = {
        store: {
          get: vi.fn()
        }
      };
      const parameters: any[] = [
        {
          filter: SocketFilters.ARGS,
          useMapper: true,
          mapIndex: 0,
          type: String,
          collectionType: Array
        }
      ];
      const scope: any = {
        args: ["any"]
      };

      const builder = new SocketHandlersBuilder(provider, PlatformTest.injector);

      // @ts-ignore
      builder.deserialize({parameters} as any, scope as any);

      expect(scope).toEqual({
        args: [["any"]]
      });
    });

    it("should map ack callback without deserialization", () => {
      const provider: any = {
        store: {
          get: vi.fn()
        }
      };
      const parameters: any[] = [
        {
          filter: SocketFilters.ARGS,
          useMapper: true,
          mapIndex: 0,
          type: Function
        }
      ];
      const ack = () => {};
      const scope: any = {
        args: [ack]
      };

      const builder = new SocketHandlersBuilder(provider, PlatformTest.injector);

      // @ts-ignore
      builder.deserialize({parameters} as any, scope as any);

      expect(scope).toEqual({
        args: [ack]
      });
    });
  });
});
