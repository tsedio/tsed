import * as Chai from "chai";
import * as Sinon from "sinon";
import * as SinonChai from "sinon-chai";
import * as ChaiAsPromised from "chai-as-promised";
import {$log} from "ts-log-debug";

Chai.should();
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

const expect = Chai.expect;
const assert = Chai.assert;

const $logStub = {
    $log: $log as any
};

Sinon.stub($log, "info");
Sinon.stub($log, "debug");
Sinon.stub($log, "error");
Sinon.stub($log, "warn");

export {
    expect,
    assert,
    Sinon,
    SinonChai,
    $logStub
};