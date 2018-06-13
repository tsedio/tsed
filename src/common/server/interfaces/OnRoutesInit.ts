import {IComponentScanned} from "./IComponentScanned";

export interface OnRoutesInit {
  $onRoutesInit(components: IComponentScanned[]): void | Promise<any>;
}
