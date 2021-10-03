import {PlatformTest} from "@tsed/common";
import {Store} from "@tsed/core";
import {InjectorService, ProviderType} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";
import {SocketHandlersBuilder} from "./SocketHandlersBuilder";
import {SocketProviderMetadata} from "./SocketProviderMetadata";

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
        $onDisconnect: Sinon.stub(),
        $onConnection: Sinon.stub(),
        $onNamespaceInit: Sinon.stub()
      };

      const provider: any = {
        store: {
          get: Sinon.stub()
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
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
      expect(builder.socketProviderMetadata).to.deep.eq(
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
      expect(instance.$onNamespaceInit).to.have.been.calledWithExactly("namespace1");
    });

    it("should add namespace1", () => {
      const {instance} = createServiceFixture();
      expect(instance.key1).to.deep.eq("namespace1");
    });

    it("should add namespace2", () => {
      const {instance} = createServiceFixture();
      expect(instance.key2).to.deep.eq("namespace2");
    });

    it("should add default nsp", () => {
      const {instance} = createServiceFixture();
      expect(instance.nsp).to.deep.eq("namespace1");
    });

    it("should init the nspSession", () => {
      const {instance} = createServiceFixture();
      expect(instance._nspSession).to.be.instanceOf(Map);
    });
  });
  describe("onConnection()", () => {
    it("should build handler and invoke onConnection instance method", () => {
      const instance = {
        $onConnection: Sinon.stub()
      };
      const provider: any = {
        store: {
          get: Sinon.stub().returns({
            injectNamespaces: [{nsp: "/nsp", propertyKey: "key"}],
            handlers: {
              $onConnection: {
                eventName: "onConnection"
              } as any
            }
          })
        }
      };
      const nspStub = {nsp: "nsp"};
      const socketStub = {
        on: Sinon.stub()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);

      const invokeStub = Sinon.stub(builder, "invoke");
      const buildHandlersStub = Sinon.stub(builder, "buildHandlers");
      const createSessionStub = Sinon.stub(builder, "createSession");
      // destroySessionStub = Sinon.stub(builder, "destroySession");

      builder.onConnection(socketStub, nspStub);

      expect(buildHandlersStub).to.have.been.calledWithExactly(socketStub, nspStub);
      expect(createSessionStub).to.have.been.calledWithExactly(socketStub);
      expect(invokeStub).to.have.been.calledWithExactly(
        instance,
        {eventName: "onConnection"},
        {
          socket: socketStub,
          nsp: nspStub
        }
      );
    });
  });
  describe("onDisconnect()", () => {
    it("should call the createSession method and create the $onDisconnect method if is missing", () => {
      const instance = {
        $onDisconnect: Sinon.stub()
      };

      const provider: any = {
        store: {
          get: Sinon.stub().returns({
            injectNamespace: "nsp",
            handlers: {
              $onDisconnect: {
                eventName: "onDisconnect"
              }
            }
          })
        }
      };
      const nspStub: any = {nsp: "nsp"};
      const socketStub: any = {
        on: Sinon.stub()
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);
      const invokeStub = Sinon.stub(builder, "invoke");
      const destroySessionStub = Sinon.stub(builder, "destroySession");

      builder.onDisconnect(socketStub, nspStub);

      expect(destroySessionStub).to.have.been.calledWithExactly(socketStub);
      expect(invokeStub).to.have.been.calledWithExactly(
        instance,
        {eventName: "onDisconnect"},
        {
          socket: socketStub,
          nsp: nspStub
        }
      );
    });
  });
  describe("createSession()", () => {
    it("should create session for the socket", () => {
      const instance = {
        _nspSession: new Map()
      };
      const provider: any = {
        store: {
          get: Sinon.stub()
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);
      builder.createSession({id: "id"});

      expect(instance._nspSession.get("id")).to.be.instanceof(Map);
    });
  });
  describe("destroySession()", () => {
    it("should destroy session for the socket", () => {
      const instance = {
        _nspSession: new Map()
      };
      const provider: any = {
        store: {
          get: Sinon.stub()
        }
      };

      instance._nspSession.set("id", new Map());

      const builder: any = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);

      builder.destroySession({id: "id"});

      expect(instance._nspSession.get("id")).to.be.undefined;
    });
  });
  describe("buildHandlers()", () => {
    before(() => {});

    it("should call socket.on() method", () => {
      const metadata = {
        handlers: {
          testHandler: {
            eventName: "eventName"
          }
        }
      };
      const provider: any = {
        store: {
          get: Sinon.stub().returns(metadata)
        }
      };
      const socketStub = {
        on: Sinon.stub()
      };
      const builder: any = new SocketHandlersBuilder(provider, {} as any);
      const runQueueStub = Sinon.stub(builder, "runQueue");

      builder.buildHandlers(socketStub, "ws");
      socketStub.on.getCall(0).args[1]("arg1");

      expect(socketStub.on).to.have.been.calledWithExactly("eventName", Sinon.match.func);
      expect(runQueueStub).to.have.been.calledWithExactly(metadata.handlers.testHandler, ["arg1"], socketStub, "ws");
    });
  });
  describe("invoke()", () => {
    it("should call the method instance", () => {
      const instance = {
        testHandler: Sinon.stub().returns("response")
      };
      const provider: any = {
        store: {
          get: Sinon.stub().returns(metadata)
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);
      const buildParametersStub = Sinon.stub(builder, "buildParameters").returns(["argMapped"]);

      builder.invoke(instance, metadata.handlers.testHandler, {scope: "scope"});

      expect(buildParametersStub).to.have.been.calledWithExactly(["param"], {
        scope: "scope"
      });

      expect(instance.testHandler).to.have.been.calledWithExactly("argMapped");
    });
  });
  describe("buildParameters()", () => {
    function createFixture() {
      const instance: any = {
        testHandler: Sinon.stub().returns("response")
      };
      const provider: any = {
        store: {
          get: Sinon.stub().returns(metadata)
        }
      };

      const builder: any = new SocketHandlersBuilder(provider, {
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

        expect(result).to.deep.eq([["mapValue"]]);
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

        expect(result).to.deep.eq(["mapValue"]);
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

        expect(result).to.deep.eq(["socket"]);
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

        expect(result).to.deep.eq(["nsp"]);
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

        expect(result).to.deep.eq(["error"]);
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

        expect(result).to.deep.eq(["eventName"]);
      });
    });

    describe("when SESSION", () => {
      it("should return a list of parameters", () => {
        const map = new Map();
        map.set("id", new Map());

        const {builder, instance, provider} = createFixture();

        instance._nspSession = map;

        const result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SESSION
            }
          },
          {socket: {id: "id"}}
        );

        expect(result[0]).instanceof(Map);
      });
    });
  });
  describe("bindResponseMiddleware()", () => {
    describe("when BROADCAST", () => {
      it("should call the ws.emit method", () => {
        const nspStub = {
          emit: Sinon.stub()
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

        expect(nspStub.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });
    describe("when BROADCAST_OTHERS", () => {
      it("should call the socket.broadcast.emit method", () => {
        const socketStub = {
          broadcast: {
            emit: Sinon.stub()
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

        expect(socketStub.broadcast.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });

    describe("when EMIT", () => {
      it("should call the socket.emit method", () => {
        const socketStub = {
          emit: Sinon.stub()
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

        expect(socketStub.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });
  });
  describe("runQueue()", () => {
    let provider: any,
      handlerMetadata: any,
      bindMiddlewareStub: any,
      bindResponseMiddlewareStub: any,
      builder: any,
      invokeStub: any,
      instance: any,
      deserializeStub: any;
    before(() => {
      provider = {
        store: {
          get: Sinon.stub().returns({
            useBefore: [{target: "target before global"}],
            useAfter: [{target: "target after global"}]
          })
        }
      };
      instance = {instance: "instance"};

      handlerMetadata = {
        eventName: "eventName",
        useBefore: [{target: "target before"}],
        useAfter: [{target: "target after"}]
      };

      bindResponseMiddlewareStub = Sinon.stub(SocketHandlersBuilder as any, "bindResponseMiddleware");

      builder = new SocketHandlersBuilder(provider, {
        get() {
          return instance;
        }
      } as any);

      invokeStub = Sinon.stub(builder, "invoke");
      bindMiddlewareStub = Sinon.stub(builder, "bindMiddleware");
      deserializeStub = Sinon.stub(builder, "deserialize");

      bindMiddlewareStub.onCall(0).resolves();
      bindMiddlewareStub.onCall(1).resolves();
      bindMiddlewareStub.onCall(2).resolves();
      bindMiddlewareStub.onCall(3).resolves();

      return builder.runQueue(handlerMetadata, ["arg1"], "socket", "nsp");
    });

    after(() => {
      bindResponseMiddlewareStub.restore();
      deserializeStub.restore();
    });

    it("should call bindMiddleware (handler before global)", () => {
      expect(bindMiddlewareStub.getCall(0)).to.have.been.calledWithExactly(
        {target: "target before global"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        Sinon.match.instanceOf(Promise)
      );
    });

    it("should call bindMiddleware (handler before)", () => {
      expect(bindMiddlewareStub.getCall(1)).to.have.been.calledWithExactly(
        {target: "target before"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        Sinon.match.instanceOf(Promise)
      );
    });

    it("should invoke method instance", () => {
      expect(builder.invoke).to.have.been.calledWithExactly(instance, handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });

    it("should call SocketHandlersBuilder.bindResponseMiddleware", () => {
      expect(bindResponseMiddlewareStub).to.have.been.calledWithExactly(handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });

    it("should call bindMiddleware (handler after)", () => {
      expect(bindMiddlewareStub.getCall(2)).to.have.been.calledWithExactly(
        {target: "target after"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        Sinon.match.instanceOf(Promise)
      );
    });

    it("should call bindMiddleware (handler after global)", () => {
      expect(bindMiddlewareStub.getCall(3)).to.have.been.calledWithExactly(
        {target: "target after global"},
        {
          eventName: "eventName",
          args: ["arg1"],
          socket: "socket",
          nsp: "nsp"
        },
        Sinon.match.instanceOf(Promise)
      );
    });

    it("should call deserialize()", () => {
      expect(deserializeStub).to.have.been.calledWithExactly(handlerMetadata, {
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
            get: Sinon.stub()
          }
        };

        Store.from(Test).set("socketIO", {
          handlers: {
            use: "use"
          }
        });

        const getProviderStub = Sinon.stub(injector as any, "getProvider").returns(false);
        const getStub = Sinon.stub(injector as any, "get").returns(undefined);

        const scope = {scope: "scope"};

        const builder: any = new SocketHandlersBuilder(provider, injector);
        const invokeStub = Sinon.stub(builder, "invoke");

        builder.bindMiddleware({target: "target"}, scope, Promise.resolve());

        expect(getStub).to.have.been.calledWithExactly({target: "target"});
        expect(invokeStub).to.not.have.been.called;

        getProviderStub.restore();
        getStub.restore();
      });
    });

    describe("middleware", () => {
      it("should call build handler from metadata", async () => {
        // GIVEN
        class Test {}

        const injector = PlatformTest.get(InjectorService);
        const getProviderStub = Sinon.stub(injector as any, "getProvider");
        const getStub = Sinon.stub(injector as any, "get");

        const instance = new Test();
        const provider = {
          token: Test,
          store: {
            get: Sinon.stub()
          }
        };

        Store.from(Test).set("socketIO", {
          type: ProviderType.MIDDLEWARE,
          handlers: {
            use: "use"
          }
        });

        // @ts-ignore
        injector.getProvider.returns({
          type: ProviderType.MIDDLEWARE
        });

        getStub.returns(instance);

        const scope = {scope: "scope", args: undefined};
        const builder: any = new SocketHandlersBuilder(provider as any, injector);
        Sinon.stub(builder, "invoke").returns({result: "result"});

        // WHEN
        await builder.bindMiddleware({target: "target"}, scope, Promise.resolve());

        // THEN
        // expect(injector.getProvider).to.have.been.calledWithExactly({target: "target"});
        expect(getStub).to.have.been.calledWithExactly({target: "target"});
        expect(builder.invoke).to.have.been.calledWithExactly(instance, "use", scope);
        expect(scope.args).to.deep.eq([{result: "result"}]);

        getProviderStub.restore();
        getStub.restore();
      });
    });

    describe("middleware error", () => {
      it("should call build handler from metadata", async () => {
        class Test {}

        const injector = PlatformTest.get(InjectorService);

        const instance = new Test();
        const provider = {
          store: {
            get: Sinon.stub()
          }
        };

        Store.from(Test).set("socketIO", {
          type: ProviderType.MIDDLEWARE,
          error: true,
          handlers: {
            use: "use"
          }
        });

        const getProviderStub = Sinon.stub(injector as any, "getProvider");
        const getStub = Sinon.stub(injector as any, "get");
        getProviderStub.returns({
          type: ProviderType.MIDDLEWARE
        });
        getStub.returns(instance);

        const scope = {scope: "scope", args: undefined};
        const error = new Error("test");
        const builder: any = new SocketHandlersBuilder(provider as any, injector);
        Sinon.stub(builder, "invoke").returns({result: "result"});

        // WHEN
        await builder.bindMiddleware({target: "target"}, scope, Promise.reject(error));

        // THEN
        expect(injector.get).to.have.been.calledWithExactly({target: "target"});
        expect(builder.invoke).to.have.been.calledWithExactly(instance, "use", {error, ...scope});
        getProviderStub.restore();
        getStub.restore();
      });
    });
  });
});
