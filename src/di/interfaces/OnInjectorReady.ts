/**
 * @module common/di
 */
/** */
export interface OnInjectorReady {
    $onInjectorReady(): Promise<any> | void;
}