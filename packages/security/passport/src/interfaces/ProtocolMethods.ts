import {BeforeInstall} from "./BeforeInstall.js";
import {OnInstall} from "./OnInstall.js";
import {OnVerify} from "./OnVerify.js";

export interface ProtocolMethods<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
