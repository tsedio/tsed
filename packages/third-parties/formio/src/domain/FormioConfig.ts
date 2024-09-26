import type {FormioSettings} from "./FormioSettings.js";
import type {FormioTemplate} from "./FormioTemplate.js";

export interface FormioJwtConfig {
  secret: string;
  expireTime?: number;
}

export interface FormioEmailConfig {
  type: string;
  username: string;
  password: string;
}

export interface FormioConfig {
  /**
   * Base url to mount the formio endpoints with Ts.ED server. Default: '/'
   */
  baseUrl: string;
  /**
   * Skip installation process
   */
  skipInstall?: boolean;

  template?: FormioTemplate;
  /**
   * Cors allowed origin configuration. Default: `["*"]`.
   */
  allowedOrigins?: string[];
  /**
   *
   */
  mongoCA?: any;
  mongo?: string;
  mongoConfig?: string;
  /**
   * Reserved keywords form name list
   */
  reservedForms?: string[];
  /**
   * Jwt configuration
   */
  jwt: FormioJwtConfig;
  /**
   * Email sendgrid settings
   */
  email?: FormioEmailConfig;
  /**
   * Settings of external formio services
   */
  settings?: FormioSettings;
  /**
   * Enable audit log. Default: false
   */
  audit?: boolean;
  /**
   * User root credentials
   */
  root: {
    email: string;
    password: string;
  };
}
