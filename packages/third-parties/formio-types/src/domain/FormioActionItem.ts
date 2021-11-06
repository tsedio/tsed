export interface FormioActionItem<Data = any> {
  _id: string | undefined;
  title: string;
  form: string;
  submission?: string;
  action: string;
  handler: string;
  method: string;
  state: "new" | "inprogress" | "complete" | "error";
  messages: any[];
  data: Data;
}
