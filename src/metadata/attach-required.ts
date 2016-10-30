
import {IInvokableFunction} from "../interfaces/InvokedFunction";
/**
 * Create metadata to set required parameters.
 * @param method
 * @param index
 * @param service
 */
export function attachRequired(method: IInvokableFunction, index: number): void {
    method.$required = method.$required || [];
    method.$required.push(index);
}