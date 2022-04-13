import {OnInstall} from "./OnInstall";
import {OnVerify} from "./OnVerify";
import {BeforeInstall} from "./BeforeInstall";

export interface ProtocolMethods<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
