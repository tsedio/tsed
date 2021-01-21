import {$log} from "@tsed/logger";
import * as Sinon from "sinon";
import {SinonStub} from "sinon";

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

export const $logStub: LogStub = {
  $log: $log as any,
  info: Sinon.stub(),
  debug: Sinon.stub(),
  error: Sinon.stub(),
  warn: Sinon.stub(),
  trace: Sinon.stub(),
  // tslint:disable-next-line
  stub: function () {
    this.info = Sinon.stub($log, "info");
    this.debug = Sinon.stub($log, "debug");
    this.error = Sinon.stub($log, "error");
    this.warn = Sinon.stub($log, "warn");
    this.trace = Sinon.stub($log, "trace");
  },
  // tslint:disable-next-line
  restore: function () {
    this.info.restore();
    this.debug.restore();
    this.error.restore();
    this.warn.restore();
    this.trace.restore();
  },
  // tslint:disable-next-line
  reset: function () {
    this.info.reset();
    this.debug.reset();
    this.error.reset();
    this.warn.reset();
    this.trace.reset();
  }
} as any;
