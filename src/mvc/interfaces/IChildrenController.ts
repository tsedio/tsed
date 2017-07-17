import {Type} from "../../core/interfaces";
/**
 * @module common/mvc
 */
/** */
import {ControllerProvider} from "../class/ControllerProvider";
export interface IChildrenController extends Type<any> {
    $parentCtrl?: ControllerProvider;
}