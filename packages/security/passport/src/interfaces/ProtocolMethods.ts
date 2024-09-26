import type {BeforeInstall} from "./BeforeInstall.js";
import type {OnInstall} from "./OnInstall.js";
import type {OnVerify} from "./OnVerify.js";

export interface ProtocolMethods<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
