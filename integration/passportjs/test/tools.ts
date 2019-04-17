import * as Chai from "chai";
import * as ChaiAsPromised from "chai-as-promised";
import * as SinonLib from "sinon";
import {SinonStub} from "sinon";
import * as SinonChai from "sinon-chai";
import {$log} from "ts-log-debug";

Chai.should();
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

const expect = Chai.expect;
const assert = Chai.assert;
const Sinon = SinonLib;

export interface LogStub {
    $log: any;
    stub: any;
    restore: any;
    reset: any;
    info: SinonStub;
    debug: SinonStub;
    error: SinonStub;
    warn: LogStub;
    trace: LogStub;
}

const $logStub: LogStub = <any> {
    $log: $log as any,
    info: Sinon.stub(),
    debug: Sinon.stub(),
    error: Sinon.stub(),
    warn: Sinon.stub(),
    trace: Sinon.stub(),
    stub: function () {
        this.info = Sinon.stub($log, "info");
        this.debug = Sinon.stub($log, "debug");
        this.error = Sinon.stub($log, "error");
        this.warn = Sinon.stub($log, "warn");
        this.trace = Sinon.stub($log, "trace");
    },
    restore: function () {
        this.info.restore();
        this.debug.restore();
        this.error.restore();
        this.warn.restore();
        this.trace.restore();
    },
    reset: function () {
        this.info.reset();
        this.debug.reset();
        this.error.reset();
        this.warn.reset();
        this.trace.reset();
    }
};

$logStub.stub();

const stub = (t: any): SinonStub => t;
const restore = (t: any) => t.restore();

export {
    expect,
    assert,
    Sinon,
    SinonChai,
    $logStub,
    stub,
    restore
};