import {isArrowFn} from "@tsed/core";
import {FormioComponent, FormioForm, FormioSubmission} from "@tsed/formio-types";
import type {Utils} from "formiojs";
import type {LoDashStatic} from "lodash";
import type {Moment} from "moment";

import {Component} from "./component.js";

export interface CustomConditionalCtx<Value = any, Data = any, Row = any> {
  /**
   * The complete submission object.
   */
  form: FormioForm;
  /**
   * The complete submission object.
   */
  submission: FormioSubmission<Data>;
  /**
   * The complete submission data object.
   */
  data: Data;
  /**
   * Contextual "row" data, used within DataGrid, EditGrid, and Container components
   */
  row: Row;
  /**
   * The current component JSON
   */
  component: FormioComponent;
  /**
   * The current component instance.
   */
  instance: any;
  /**
   * The current value of the component.
   */
  value: Value;
  /**
   * The moment.js library for date manipulation.
   */
  moment: Moment;
  /**
   * An instance of Lodash.
   */
  _: LoDashStatic;
  /**
   * An instance of the FormioUtils object.
   */
  utils: typeof Utils;
  /**
   * An alias for "utils".
   */
  util: typeof Utils;
}

function sanitize(customConditional: Function) {
  const str = customConditional.toString();

  const [signature, ...fn] = str.split("=>");
  let content = fn.join("=>");

  if (!signature.includes("{")) {
    content = content.replace(new RegExp(`${signature.trim()}.`, "gi"), "");
  }

  return `show = ${content.trim()}`;
}

/**
 * Adds custom conditional rule to display or not the input form.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param customConditional
 */
export function CustomConditional(customConditional: string | ((ctx: CustomConditionalCtx) => any)) {
  if (isArrowFn(customConditional)) {
    customConditional = sanitize(customConditional);
  }

  return Component({
    customConditional
  });
}
