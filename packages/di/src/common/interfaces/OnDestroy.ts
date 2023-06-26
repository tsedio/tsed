export interface OnDestroy {
  $onDestroy(): Promise<any> | void;
}
