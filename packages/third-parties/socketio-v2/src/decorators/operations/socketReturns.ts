import {Returns} from "@tsed/schema";
import {SocketReturnsTypes} from "../../interfaces/SocketReturnsTypes";

/**
 *
 * @param {string} eventName
 * @param {SocketReturnsTypes} type
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => void}
 * @decorator
 */
export function SocketReturns(eventName: string, type: SocketReturnsTypes) {
  return Returns(200).Type(type).Subscribe(eventName);
}
