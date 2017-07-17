/**
 * @module common/server
 */
/** */

export interface OnServerReady {
    $onServerReady(): void | Promise<any>;
}