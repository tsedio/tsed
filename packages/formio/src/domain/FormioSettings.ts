export interface FormioSettings extends Record<string, any> {
  office365: {
    tenant: string;
    clientId: string;
    email: string;
    cert: string;
    thumbprint: string;

    [key: string]: any;
  };

  databases: {
    mysql: {
      host: string;
      port: string;
      database: string;
      user: string;
      password: string;

      [key: string]: any;
    };
    mssql: {
      host: string;
      port: string;
      database: string;
      user: string;
      password: string;

      [key: string]: any;
    };
  };
  email: {
    gmail: {
      auth: {
        user: string;
        pass: string;
        [key: string]: any;
      };

      [key: string]: any;
    };
    sendgrid: {
      auth: {
        api_user: string;
        api_key: string;

        [key: string]: any;
      };

      [key: string]: any;
    };
    mandrill: {
      auth: {
        apiKey: string;

        [key: string]: any;
      };
      [key: string]: any;
    };
  };
}
