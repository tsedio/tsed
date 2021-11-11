import {Component} from "./component";

/**
 * Opens up a modal to edit the value of this component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function ModalEdit(modalEdit = true) {
  return Component({
    modalEdit
  });
}
