import {OnInstall} from "./OnInstall";
import {OnVerify} from "./OnVerify";

export interface IProtocol extends OnVerify, OnInstall {}
