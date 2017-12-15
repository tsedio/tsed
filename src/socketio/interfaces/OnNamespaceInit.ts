/**
 * @experimental
 */
export interface OnNamespaceInit {
    $onNamespaceInit(nsp: SocketIO.Namespace): void;
}