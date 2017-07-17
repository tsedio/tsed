/**
 * @module common/server
 */
/** */

export interface AfterRoutesInit {
    $afterRoutesInit(): void | Promise<any>;
}