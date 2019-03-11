import {SinonStub} from "sinon";

export * from "./logger";

const stub = (t: any): SinonStub => t;
const restore = (t: any) => t.restore();

export {stub, restore};
