import type {Namespace} from "socket.io";

/**
 *
 */
export interface OnNamespaceInit {
  $onNamespaceInit(nsp: Namespace): void;
}
