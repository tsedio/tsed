export interface FormioAction<Settings = any> {
  name: string;
  title: string;
  action: string;
  handler: string[];
  method: string[];
  priority: number;
  form: any;
  settings: Settings;
  condition?: any;
  deleted?: number | null;
}
