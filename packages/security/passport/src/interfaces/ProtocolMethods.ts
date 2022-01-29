import {OnInstall} from "./OnInstall";
import {OnVerify} from "./OnVerify";
import {BeforeInstall} from "./BeforeInstall";

/**
 * @deprecated Use ProtocolMethods instead
 */
export interface IProtocol<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
export interface ProtocolMethods<Settings = any> extends OnVerify, OnInstall, BeforeInstall<Settings> {}
