import {Store} from "@tsed/core";
import {PlatformTest} from "@tsed/common";
import {InjectorService, ProviderType} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {SocketHandlersBuilder} from "./SocketHandlersBuilder";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";

describe("SocketHandlersBuilder", () => {
  describe("build()", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        },
        instance: {
          $onDisconnect: Sinon.stub(),
          $onConnection: Sinon.stub(),
          $onNamespaceInit: Sinon.stub()
        }
      };

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.builder.socketProviderMetadata = {
        namespace: "/",
        injectNamespaces: [{propertyKey: "key1"}, {propertyKey: "key2", nsp: "/test"}],
        handlers: {
          $onDisconnect: {}
        }
      };

      this.nsps = new Map();
      this.nsps.set("/", "namespace1");
      this.nsps.set("/test", "namespace2");

      this.builder.build(this.nsps);
    });

    it("should create metadata when $onDisconnect exists", () => {
      expect(this.builder.socketProviderMetadata).to.deep.eq({
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
      });
    });

    it("should call $onNamespaceInit hook", () => {
      expect(this.provider.instance.$onNamespaceInit).to.have.been.calledWithExactly("namespace1");
    });

    it("should add namespace1", () => {
      expect(this.provider.instance.key1).to.deep.eq("namespace1");
    });

    it("should add namespace2", () => {
      expect(this.provider.instance.key2).to.deep.eq("namespace2");
    });

    it("should add default nsp", () => {
      expect(this.provider.instance.nsp).to.deep.eq("namespace1");
    });

    it("should init the nspSession", () => {
      expect(this.provider.instance._nspSession).to.be.instanceOf(Map);
    });
  });

  describe("onConnection", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        },
        instance: {
          $onConnection: Sinon.stub()
        }
      };
      this.nspStub = {nsp: "nsp"};
      this.socketStub = {
        on: Sinon.stub()
      };

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.builder.socketProviderMetadata = {
        injectNamespace: "nsp",
        handlers: {
          $onConnection: {
            eventName: "onConnection"
          }
        }
      };

      this.invokeStub = Sinon.stub(this.builder, "invoke");
      this.buildHandlersStub = Sinon.stub(this.builder, "buildHandlers");
      this.createSessionStub = Sinon.stub(this.builder, "createSession");
      // this.destroySessionStub = Sinon.stub(this.builder, "destroySession");

      this.builder.onConnection(this.socketStub, this.nspStub);
    });

    it("should call the buildHandlers method", () => {
      expect(this.buildHandlersStub).to.have.been.calledWithExactly(this.socketStub, this.nspStub);
    });

    it("should call the createSession method", () => {
      expect(this.createSessionStub).to.have.been.calledWithExactly(this.socketStub);
    });

    it("should add metadata when $onConnection exists", () => {
      expect(this.invokeStub).to.have.been.calledWithExactly(
        this.provider.instance,
        {eventName: "onConnection"},
        {
          socket: this.socketStub,
          nsp: this.nspStub
        }
      );
    });
  });
  describe("onDisconnect", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        },
        instance: {
          $onDisconnect: Sinon.stub()
        }
      };
      this.nspStub = {nsp: "nsp"};
      this.socketStub = {
        on: Sinon.stub()
      };

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.builder.socketProviderMetadata = {
        injectNamespace: "nsp",
        handlers: {
          $onDisconnect: {
            eventName: "onDisconnect"
          }
        }
      };

      this.invokeStub = Sinon.stub(this.builder, "invoke");
      this.destroySessionStub = Sinon.stub(this.builder, "destroySession");

      this.builder.onDisconnect(this.socketStub, this.nspStub);
    });

    it("should call the createSession method", () => {
      expect(this.destroySessionStub).to.have.been.calledWithExactly(this.socketStub);
    });

    it("should add metadata when $onDisconnect exists", () => {
      expect(this.invokeStub).to.have.been.calledWithExactly(
        this.provider.instance,
        {eventName: "onDisconnect"},
        {
          socket: this.socketStub,
          nsp: this.nspStub
        }
      );
    });
  });

  describe("createSession()", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        },
        instance: {
          _nspSession: new Map()
        }
      };

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.builder.createSession({id: "id"});
    });

    it("should create session for the socket", () => {
      expect(this.provider.instance._nspSession.get("id")).to.be.instanceof(Map);
    });
  });

  describe("destroySession()", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        },
        instance: {
          _nspSession: new Map()
        }
      };

      this.provider.instance._nspSession.set("id", new Map());

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.builder.destroySession({id: "id"});
    });

    it("should destroy session for the socket", () => {
      expect(this.provider.instance._nspSession.get("id")).to.be.undefined;
    });
  });

  describe("buildHandlers()", () => {
    before(() => {
      this.metadata = {
        handlers: {
          testHandler: {
            eventName: "eventName"
          }
        }
      };
      this.provider = {
        store: {
          get: Sinon.stub().returns(this.metadata)
        }
      };
      this.socketStub = {
        on: Sinon.stub()
      };
      const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.runQueueStub = Sinon.stub(builder, "runQueue");

      builder.buildHandlers(this.socketStub, "ws");
      this.socketStub.on.getCall(0).args[1]("arg1");
    });

    it("should call socket.on() method", () => {
      expect(this.socketStub.on).to.have.been.calledWithExactly("eventName", Sinon.match.func);
    });

    it("should call runQueue method", () => {
      expect(this.runQueueStub).to.have.been.calledWithExactly(this.metadata.handlers.testHandler, ["arg1"], this.socketStub, "ws");
    });
  });

  describe("invoke()", () => {
    before(() => {
      this.metadata = {
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

      this.provider = {
        store: {
          get: Sinon.stub().returns(this.metadata)
        },
        instance: {
          testHandler: Sinon.stub().returns("response")
        }
      };

      const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);
      this.buildParametersStub = Sinon.stub(builder, "buildParameters").returns(["argMapped"]);

      builder.invoke(this.provider.instance, this.metadata.handlers.testHandler, {scope: "scope"});
    });

    it("should call buildParameters", () => {
      expect(this.buildParametersStub).to.have.been.calledWithExactly(["param"], {
        scope: "scope"
      });
    });

    it("should call the method instance", () => {
      expect(this.provider.instance.testHandler).to.have.been.calledWithExactly("argMapped");
    });
  });

  describe("buildParameters()", () => {
    describe("when ARGS", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ARGS
            }
          },
          {args: ["mapValue"]}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq([["mapValue"]]);
      });
    });

    describe("when ARGS with mapIndex", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ARGS,
              mapIndex: 0
            }
          },
          {args: ["mapValue"]}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq(["mapValue"]);
      });
    });

    describe("when Socket", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SOCKET
            }
          },
          {socket: "socket"}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq(["socket"]);
      });
    });

    describe("when NSP", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.NSP
            }
          },
          {nsp: "nsp"}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq(["nsp"]);
      });
    });

    describe("when ERROR", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.ERR
            }
          },
          {error: "error"}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq(["error"]);
      });
    });

    describe("when EVENT_NAME", () => {
      before(() => {
        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response")
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.EVENT_NAME
            }
          },
          {eventName: "eventName"}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result).to.deep.eq(["eventName"]);
      });
    });

    describe("when SESSION", () => {
      before(() => {
        const map = new Map();
        map.set("id", new Map());

        this.provider = {
          store: {
            get: Sinon.stub().returns(this.metadata)
          },
          instance: {
            testHandler: Sinon.stub().returns("response"),
            _nspSession: map
          }
        };

        const builder: any = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

        this.result = builder.buildParameters(
          {
            0: {
              filter: SocketFilters.SESSION
            }
          },
          {socket: {id: "id"}}
        );
      });

      it("should return a list of parameters", () => {
        expect(this.result[0]).instanceof(Map);
      });
    });
  });

  describe("bindResponseMiddleware()", () => {
    describe("when BROADCAST", () => {
      before(() => {
        this.nspStub = {
          emit: Sinon.stub()
        };

        (SocketHandlersBuilder as any).bindResponseMiddleware(
          {
            returns: {
              type: SocketReturnsTypes.BROADCAST,
              eventName: "eventName"
            }
          },
          {nsp: this.nspStub}
        )({response: "response"});
      });
      it("should call the ws.emit method", () => {
        expect(this.nspStub.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });
    describe("when BROADCAST_OTHERS", () => {
      before(() => {
        this.socketStub = {
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
          {socket: this.socketStub}
        )({response: "response"});
      });
      it("should call the socket.broadcast.emit method", () => {
        expect(this.socketStub.broadcast.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });

    describe("when EMIT", () => {
      before(() => {
        this.socketStub = {
          emit: Sinon.stub()
        };

        (SocketHandlersBuilder as any).bindResponseMiddleware(
          {
            returns: {
              type: SocketReturnsTypes.EMIT,
              eventName: "eventName"
            }
          },
          {socket: this.socketStub}
        )({response: "response"});
      });
      it("should call the socket.emit method", () => {
        expect(this.socketStub.emit).to.have.been.calledWithExactly("eventName", {response: "response"});
      });
    });
  });

  describe("runQueue()", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub().returns({
            useBefore: [{target: "target before global"}],
            useAfter: [{target: "target after global"}]
          })
        },
        instance: {instance: "instance"}
      };

      this.handlerMetadata = {
        eventName: "eventName",
        useBefore: [{target: "target before"}],
        useAfter: [{target: "target after"}]
      };

      this.bindResponseMiddlewareStub = Sinon.stub(SocketHandlersBuilder as any, "bindResponseMiddleware");

      this.builder = new SocketHandlersBuilder(this.provider, {} as any, {} as any);

      this.invokeStub = Sinon.stub(this.builder, "invoke");
      this.bindMiddlewareStub = Sinon.stub(this.builder, "bindMiddleware");
      this.deserializeStub = Sinon.stub(this.builder, "deserialize");

      this.bindMiddlewareStub.onCall(0).resolves();
      this.bindMiddlewareStub.onCall(1).resolves();
      this.bindMiddlewareStub.onCall(2).resolves();
      this.bindMiddlewareStub.onCall(3).resolves();

      return this.builder.runQueue(this.handlerMetadata, ["arg1"], "socket", "nsp");
    });

    after(() => {
      this.bindResponseMiddlewareStub.restore();
      this.deserializeStub.restore();
    });

    it("should call bindMiddleware (handler before global)", () => {
      expect(this.bindMiddlewareStub.getCall(0)).to.have.been.calledWithExactly(
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
      expect(this.bindMiddlewareStub.getCall(1)).to.have.been.calledWithExactly(
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
      expect(this.builder.invoke).to.have.been.calledWithExactly(this.provider.instance, this.handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });

    it("should call SocketHandlersBuilder.bindResponseMiddleware", () => {
      expect(this.bindResponseMiddlewareStub).to.have.been.calledWithExactly(this.handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });

    it("should call bindMiddleware (handler after)", () => {
      expect(this.bindMiddlewareStub.getCall(2)).to.have.been.calledWithExactly(
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
      expect(this.bindMiddlewareStub.getCall(3)).to.have.been.calledWithExactly(
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
      expect(this.deserializeStub).to.have.been.calledWithExactly(this.handlerMetadata, {
        eventName: "eventName",
        args: ["arg1"],
        socket: "socket",
        nsp: "nsp"
      });
    });
  });

  describe("bindMiddleware()", () => {
    describe("middleware is not registered", () => {
      class Test {}

      before(
        PlatformTest.inject([InjectorService], (injector: InjectorService) => {
          this.instance = new Test();
          this.provider = {
            store: {
              get: Sinon.stub()
            }
          };

          Store.from(Test).set("socketIO", {
            handlers: {
              use: "use"
            }
          });

          this.getStub = Sinon.stub(injector as any, "getProvider").returns(false);

          this.scope = {scope: "scope"};

          this.builder = new SocketHandlersBuilder(this.provider, {} as any, injector);
          this.invokeStub = Sinon.stub(this.builder, "invoke");

          return this.builder.bindMiddleware({target: "target"}, this.scope, Promise.resolve());
        })
      );
      after(() => {
        this.getStub.restore();
      });

      it("should call Middleware.get", () => {
        expect(this.getStub).to.have.been.calledWithExactly({target: "target"});
      });

      it("should invoke method", () => {
        return expect(this.invokeStub).to.not.have.been.called;
      });
    });

    describe("middleware", () => {
      class Test {}

      before(
        PlatformTest.inject([InjectorService], (injector: InjectorService) => {
          Sinon.stub(injector as any, "getProvider");
        })
      );
      after(
        PlatformTest.inject([InjectorService], (injector: InjectorService) => {
          // @ts-ignore
          injector.getProvider.restore();
        })
      );

      it(
        "should call build handler from metadata",
        PlatformTest.inject([InjectorService], async (injector: InjectorService) => {
          // GIVEN
          const instance = new Test();
          const provider = {
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
            instance,
            type: ProviderType.MIDDLEWARE
          });

          const scope = {scope: "scope", args: undefined};
          const builder: any = new SocketHandlersBuilder(provider as any, {} as any, injector);
          Sinon.stub(builder, "invoke").returns({result: "result"});

          // WHEN
          await builder.bindMiddleware({target: "target"}, scope, Promise.resolve());

          // THEN
          expect(injector.getProvider).to.have.been.calledWithExactly({target: "target"});
          expect(builder.invoke).to.have.been.calledWithExactly(instance, "use", scope);
          expect(scope.args).to.deep.eq([{result: "result"}]);
        })
      );
    });

    describe("middleware error", () => {
      class Test {}

      before(
        PlatformTest.inject([InjectorService], (injector: InjectorService) => {
          Sinon.stub(injector as any, "getProvider");
        })
      );
      after(
        PlatformTest.inject([InjectorService], (injector: InjectorService) => {
          // @ts-ignore
          injector.getProvider.restore();
        })
      );

      it(
        "should call build handler from metadata",
        PlatformTest.inject([InjectorService], async (injector: InjectorService) => {
          // GIVEN
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

          // @ts-ignore
          injector.getProvider.returns({
            instance,
            type: ProviderType.MIDDLEWARE
          });

          const scope = {scope: "scope", args: undefined};
          const error = new Error("test");
          const builder: any = new SocketHandlersBuilder(provider as any, {} as any, injector);
          Sinon.stub(builder, "invoke").returns({result: "result"});

          // WHEN
          await builder.bindMiddleware({target: "target"}, scope, Promise.reject(error));

          // THEN
          expect(injector.getProvider).to.have.been.calledWithExactly({target: "target"});
          expect(builder.invoke).to.have.been.calledWithExactly(instance, "use", {error, ...scope});
        })
      );
    });
  });

  describe("deserialize()", () => {
    before(() => {
      this.provider = {
        store: {
          get: Sinon.stub()
        }
      };
      const parameters: any[] = [
        {
          filter: SocketFilters.ARGS,
          useConverter: true,
          mapIndex: 0,
          type: String,
          collectionType: Array
        }
      ];
      const scope: any = {
        args: ["any"]
      };

      this.converterService = {
        deserialize: Sinon.stub().returns("value")
      };

      this.builder = new SocketHandlersBuilder(this.provider, this.converterService as any, {} as any);

      this.result = this.builder.deserialize({parameters} as any, scope as any);
    });

    it("should call ConverterService.deserialize", () => {
      expect(this.converterService.deserialize).to.have.been.calledWithExactly("any", String, Array);
    });
  });
});
