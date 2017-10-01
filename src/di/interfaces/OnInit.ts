/**
 * @module common/di
 */
/** */
export interface OnInit {
    $onInit(): Promise<any> | void;
}