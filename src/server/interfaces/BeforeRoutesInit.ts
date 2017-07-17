/**
 * @module common/server
 */
/** */

export interface BeforeRoutesInit {
    $beforeRoutesInit(): void | Promise<any>;
}