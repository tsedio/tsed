import {Type} from "@tsed/core";
import {ControllerProvider} from "../class/ControllerProvider";

export interface IChildrenController extends Type<any> {
    $parentCtrl?: ControllerProvider;
}