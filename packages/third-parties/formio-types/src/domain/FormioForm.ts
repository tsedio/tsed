import {FormioComponent} from "./FormioComponent";
import {FormioPermission} from "./FormioPermission";

export interface FormioForm extends Record<string, any> {
  _id: string | undefined;
  /**
   * The title for the form
   */
  title: string;
  /**
   * The machine name for this form
   */
  name: string;
  /**
   * The path for this resource
   */
  path: string;
  /**
   * The form type.
   */
  type: string;
  /**
   * The display method for this form
   */
  display?: "form" | "wizard" | string;
  /**
   * A custom action URL to submit the data to.
   */
  action?: string;

  tags?: string[];

  deleted: number | null;
  /**
   * Access rules
   */
  access: FormioPermission[];
  /**
   * Submission access rules
   */
  submissionAccess: FormioPermission[];
  /**
   *
   */
  owner: string;
  /**
   * Components.
   */
  components: FormioComponent[];
  /**
   * Custom form settings object.
   */
  settings?: any;
  /**
   * Custom form properties.
   */
  properties?: any;
}
