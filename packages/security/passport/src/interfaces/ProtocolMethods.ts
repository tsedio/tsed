import {OnInstall} from "./OnInstall.js";
import {OnVerify} from "./OnVerify.js";
import {BeforeInstall} from "./BeforeInstall.js";

export interface ProtocolMethods<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
