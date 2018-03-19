import {Store} from "@tsed/core";
import {MiddlewareRegistry, MiddlewareType} from "../../../../src/common/mvc";
import {SocketHandlersBuilder} from "../../../../src/socketio/class/SocketHandlersBuilder";
import {SocketFilters} from "../../../../src/socketio/interfaces/SocketFilters";
import {SocketReturnsTypes} from "../../../../src/socketio/interfaces/SocketReturnsTypes";
import {expect, Sinon} from "../../../tools";

describe("SocketHandlersBuilder", () => {
    describe("build()", () => {

        before(() => {
            this.provider = {
                store: {
                    get: Sinon.stub()
                },
                instance: {
                    $onDisconnect: Sinon.stub(),
                    $onNamespaceInit: Sinon.stub()
                }
            };
            this.nspStub = {
                on: Sinon.stub()
            };
            this.socketStub = {
                on: Sinon.stub()
            };

            this.builder = new SocketHandlersBuilder(this.provider);
            this.builder.socketProviderMetadata = {
                injectNamespace: "nsp",
                handlers: {
                    $onDisconnect: {}
                }
            };

            this.onConnectionStub = Sinon.stub(this.builder, "onConnection");

            this.builder.build(this.nspStub);

            this.nspStub.on.getCall(0).args[1](this.socketStub);
        });

        after(() => {
            this.onConnectionStub.restore();
        });

        it("should create metadata when $onDisconnect exists", () => {
            expect(this.builder.socketProviderMetadata).to.deep.eq({
                "handlers": {
                    "$onDisconnect": {
                        "eventName": "disconnect",
                        "methodClassName": "$onDisconnect"
                    }
                },
                "injectNamespace": "nsp"
            });
        });

        it("should call ws.on('connection') method", () => {
            this.nspStub.on.should.have.been.calledWithExactly("connection", Sinon.match.func);
        });

        it("should call onConnection method", () => {
            this.onConnectionStub.should.have.been.calledWithExactly(this.socketStub, this.nspStub);
        });

        it("should call $onNamespaceInit hook", () => {
            this.provider.instance.$onNamespaceInit.should.have.been.calledWithExactly(this.nspStub);
        });

        it("should init the nspSession", () => {
            expect(this.provider.instance._nspSession).to.be.instanceOf(Map);
        });

        it("should inject the socket.Namespace instance", () => (
            expect(this.provider.instance.nsp).to.deep.eq(this.nspStub)
        ));
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

            this.builder = new SocketHandlersBuilder(this.provider);
            this.builder.socketProviderMetadata = {
                injectNamespace: "nsp",
                handlers: {
                    $onConnection: {}
                }
            };

            this.invokeStub = Sinon.stub(this.builder, "invoke");
            this.buildHandlersStub = Sinon.stub(this.builder, "buildHandlers");
            this.createSessionStub = Sinon.stub(this.builder, "createSession");
            this.destroySessionStub = Sinon.stub(this.builder, "destroySession");

            this.builder.onConnection(this.socketStub, this.nspStub);

            this.socketStub.on.getCall(0).args[1]();
        });

        it("should call the buildHandlers method", () => {
            this.buildHandlersStub.should.have.been.calledWithExactly(this.socketStub, this.nspStub);
        });

        it("should call the createSession method", () => {
            this.createSessionStub.should.have.been.calledWithExactly(this.socketStub);
        });

        it("should register disconnect event", () => {
            this.socketStub.on.should.have.been.calledWithExactly("disconnect", Sinon.match.func);
        });

        it("should call the createSession method", () => {
            this.destroySessionStub.should.have.been.calledWithExactly(this.socketStub);
        });

        it("should add metadata when $onConnection exists", () => {
            this.invokeStub.should.have.been.calledWithExactly(this.provider.instance, {methodClassName: "$onConnection"}, {
                socket: this.socketStub,
                nsp: this.nspStub
            });
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

            this.builder = new SocketHandlersBuilder(this.provider);
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

            this.provider.instance._nspSession.set("id", new Map);

            this.builder = new SocketHandlersBuilder(this.provider);
            this.builder.destroySession({id: "id"});
        });

        it("should destroy session for the socket", () => {
            return expect(this.provider.instance._nspSession.get("id")).to.be.undefined;
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
            const builder: any = new SocketHandlersBuilder(this.provider);
            this.runQueueStub = Sinon.stub(builder, "runQueue");

            builder.buildHandlers(this.socketStub, "ws");
            this.socketStub.on.getCall(0).args[1]("arg1");
        });

        it("should call socket.on() method", () => {
            this.socketStub.on.should.have.been.calledWithExactly("eventName", Sinon.match.func);
        });

        it("should call runQueue method", () => {
            this.runQueueStub.should.have.been.calledWithExactly(this.metadata.handlers.testHandler, ["arg1"], this.socketStub, "ws");
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

            const builder: any = new SocketHandlersBuilder(this.provider);
            this.buildParametersStub = Sinon.stub(builder, "buildParameters").returns(["argMapped"]);

            builder.invoke(this.provider.instance, this.metadata.handlers.testHandler, {scope: "scope"});
        });

        it("should call buildParameters", () => {
            this.buildParametersStub.should.have.been.calledWithExactly(["param"], {
                scope: "scope"
            });
        });

        it("should call the method instance", () => {
            this.provider.instance.testHandler.should.have.been.calledWithExactly("argMapped");
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.ARGS
                    }
                }, {args: ["mapValue"]});
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.ARGS,
                        mapIndex: 0
                    }
                }, {args: ["mapValue"]});
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.SOCKET
                    }
                }, {socket: "socket"});
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.NSP
                    }
                }, {nsp: "nsp"});
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.ERR
                    }
                }, {error: "error"});
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

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.EVENT_NAME
                    }
                }, {eventName: "eventName"});
            });

            it("should return a list of parameters", () => {
                expect(this.result).to.deep.eq(["eventName"]);
            });
        });

        describe("when SESSION", () => {
            before(() => {
                const map = new Map();
                map.set("id", new Map);

                this.provider = {
                    store: {
                        get: Sinon.stub().returns(this.metadata)
                    },
                    instance: {
                        testHandler: Sinon.stub().returns("response"),
                        _nspSession: map
                    }
                };

                const builder: any = new SocketHandlersBuilder(this.provider);

                this.result = builder.buildParameters({
                    0: {
                        filter: SocketFilters.SESSION
                    }
                }, {socket: {id: "id"}});
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
                this.nspStub.emit.should.have.been.calledWithExactly("eventName", {response: "response"});
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
                this.socketStub.broadcast.emit.should.have.been.calledWithExactly("eventName", {response: "response"});
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
                this.socketStub.emit.should.have.been.calledWithExactly("eventName", {response: "response"});
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
                useBefore: [
                    {target: "target before"}
                ],
                useAfter: [
                    {target: "target after"}
                ]
            };

            this.bindResponseMiddlewareStub = Sinon.stub(SocketHandlersBuilder as any, "bindResponseMiddleware");

            this.builder = new SocketHandlersBuilder(this.provider);

            this.invokeStub = Sinon.stub(this.builder, "invoke");
            this.bindMiddlewareStub = Sinon.stub(this.builder, "bindMiddleware");
            this.bindMiddlewareStub.onCall(0).returns(Promise.resolve());
            this.bindMiddlewareStub.onCall(1).returns(Promise.resolve());
            this.bindMiddlewareStub.onCall(2).returns(Promise.resolve());
            this.bindMiddlewareStub.onCall(3).returns(Promise.resolve());

            return this.builder.runQueue(this.handlerMetadata, ["arg1"], "socket", "nsp");
        });

        after(() => {
            this.bindResponseMiddlewareStub.restore();
        });

        it("should call bindMiddleware (handler before global)", () => {
            this.bindMiddlewareStub.getCall(0).should.have.been.calledWithExactly(
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
            this.bindMiddlewareStub.getCall(1).should.have.been.calledWithExactly(
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
            this.builder.invoke.should.have.been.calledWithExactly(this.provider.instance, this.handlerMetadata, {
                eventName: "eventName",
                args: ["arg1"],
                socket: "socket",
                nsp: "nsp"
            });
        });

        it("should call SocketHandlersBuilder.bindResponseMiddleware", () => {
            this.bindResponseMiddlewareStub.should.have.been.calledWithExactly(this.handlerMetadata, {
                eventName: "eventName",
                args: ["arg1"],
                socket: "socket",
                nsp: "nsp"
            });
        });

        it("should call bindMiddleware (handler after)", () => {
            this.bindMiddlewareStub.getCall(2).should.have.been.calledWithExactly(
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
            this.bindMiddlewareStub.getCall(3).should.have.been.calledWithExactly(
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
    });

    describe("bindMiddleware()", () => {

        describe("middleware is not registered", () => {
            class Test {
            }

            before(() => {
                this.instance = new Test;
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

                this.getStub = Sinon.stub(MiddlewareRegistry as any, "get").returns(false);

                this.scope = {scope: "scope"};

                this.builder = new SocketHandlersBuilder(this.provider);
                this.invokeStub = Sinon.stub(this.builder, "invoke");

                return this.builder.bindMiddleware({target: "target"}, this.scope, Promise.resolve());
            });
            after(() => {
                this.getStub.restore();
            });

            it("should call Middleware.get", () => {
                this.getStub.should.have.been.calledWithExactly({target: "target"});
            });

            it("should invoke method", () => {
                return this.invokeStub.should.not.have.been.called;
            });
        });

        describe("middleware", () => {
            class Test {
            }

            before(() => {
                this.instance = new Test;
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

                this.getStub = Sinon.stub(MiddlewareRegistry as any, "get").returns({
                    instance: this.instance,
                    type: MiddlewareType.MIDDLEWARE
                });

                this.scope = {scope: "scope"};

                this.builder = new SocketHandlersBuilder(this.provider);
                this.invokeStub = Sinon.stub(this.builder, "invoke").returns({result: "result"});
                return this.builder.bindMiddleware({target: "target"}, this.scope, Promise.resolve());
            });
            after(() => {
                this.getStub.restore();
            });

            it("should call Middleware.get", () => {
                this.getStub.should.have.been.calledWithExactly({target: "target"});
            });

            it("should invoke method", () => {
                this.invokeStub.should.have.been.calledWithExactly(
                    this.instance,
                    "use",
                    this.scope
                );
            });

            it("should store args", () => {
                expect(this.scope.args).to.deep.eq([{result: "result"}]);
            });
        });

        describe("middleware error", () => {
            class Test {
            }

            before(() => {
                this.instance = new Test;
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

                this.getStub = Sinon.stub(MiddlewareRegistry as any, "get").returns({
                    instance: this.instance,
                    type: MiddlewareType.ERROR
                });

                this.scope = {scope: "scope"};
                this.error = new Error("test");

                this.builder = new SocketHandlersBuilder(this.provider);
                this.invokeStub = Sinon.stub(this.builder, "invoke").returns(Promise.resolve());
                return this.builder.bindMiddleware({target: "target"}, this.scope, Promise.reject(this.error));
            });
            after(() => {
                this.getStub.restore();
            });

            it("should call Middleware.get", () => {
                this.getStub.should.have.been.calledWithExactly({target: "target"});
            });

            it("should invoke method", () => {
                this.invokeStub.should.have.been.calledWithExactly(
                    this.instance,
                    "use",
                    {error: this.error, ...this.scope}
                );
            });
        });

    });
});