import * as Chai from "chai";
import * as SinonLib from "sinon";
import {SinonStub} from "sinon";
/**
 * @deprecated
 */
const expect = Chai.expect;
/**
 * @deprecated
 */
const assert = Chai.assert;
/**
 * @deprecated
 */
// tslint:disable-next-line: variable-name
const Sinon = SinonLib;

export * from "./logger";

const stub = (t: any): SinonStub => t;
const restore = (t: any) => t.restore();

export {expect, assert, Sinon, stub, restore};
