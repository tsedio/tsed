import {Component} from "./component";

/**
 * An input mask helps the user with input by ensuring a predefined format.
 *
 * - 9: numeric
 * - a: alphabetical
 * - *: alphanumeric
 *
 * Example telephone mask: (999) 999-9999
 *
 * See the [jquery.inputmask](https://github.com/RobinHerbots/Inputmask) documentation for more information.
 *
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Mask(inputMask: string, inputMaskPlaceholderChar: string = "") {
  return Component({
    inputMask,
    inputMaskPlaceholderChar
  });
}

/**
 * An input mask helps the user with input by ensuring a predefined format.
 *
 * - 9: numeric
 * - a: alphabetical
 * - *: alphanumeric
 *
 * Example telephone mask: (999) 999-9999
 *
 * See the [jquery.inputmask](https://github.com/RobinHerbots/Inputmask) documentation for more information.
 *
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Masks(...inputMasks: {label: string; mask: string}[]) {
  return Component({
    inputMasks
  });
}
