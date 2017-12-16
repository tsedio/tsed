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
            this.invokeStub.should.have.been.calledWithExactly({methodClassName: "$onConnection"}, [], this.socketStub, this.nspStub);
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
            this.invokeStub = Sinon.stub(builder, "invoke");

            builder.buildHandlers(this.socketStub, "ws");
            this.socketStub.on.getCall(0).args[1]("arg1");
        });

        it("should called socket.on() method", () => {
            this.socketStub.on.should.have.been.calledWithExactly("eventName", Sinon.match.func);
        });

        it("should called invoke method", () => {
            this.invokeStub.should.have.been.calledWithExactly(this.metadata.handlers.testHandler, ["arg1"], this.socketStub, "ws");
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
            this.sendResponseStub = Sinon.stub(SocketHandlersBuilder as any, "sendResponse");

            builder.invoke(this.metadata.handlers.testHandler, ["arg1"], "socket", "nsp");
        });
        after(() => {
            this.sendResponseStub.restore();
        });

        it("should call buildParameters", () => {
            this.buildParametersStub.should.have.been.calledWithExactly(["param"], {
                nsp: "nsp",
                socket: "socket",
                args: ["arg1"]
            });
        });

        it("should call the method instance", () => {
            this.provider.instance.testHandler.should.have.been.calledWithExactly("argMapped");
        });

        it("should call SocketHandlersBuilder.sendResponse method", () => {
            this.sendResponseStub.should.have.been.calledWithExactly("returnEventName", "type", "response", {
                nsp: "nsp",
                socket: "socket",
                args: ["arg1"]
            });
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

    describe("sendResponse()", () => {
        describe("when BROADCAST", () => {
            before(() => {
                this.nspStub = {
                    emit: Sinon.stub()
                };

                (SocketHandlersBuilder as any).sendResponse(
                    "eventName",
                    SocketReturnsTypes.BROADCAST,
                    {response: "response"},
                    {nsp: this.nspStub}
                );
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

                (SocketHandlersBuilder as any).sendResponse(
                    "eventName",
                    SocketReturnsTypes.BROADCAST_OTHERS,
                    {response: "response"},
                    {socket: this.socketStub}
                );
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

                (SocketHandlersBuilder as any).sendResponse(
                    "eventName",
                    SocketReturnsTypes.EMIT,
                    {response: "response"},
                    {socket: this.socketStub}
                );
            });
            it("should call the socket.emit method", () => {
                this.socketStub.emit.should.have.been.calledWithExactly("eventName", {response: "response"});
            });
        });
    });
});