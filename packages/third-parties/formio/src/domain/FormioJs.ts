export interface FormioJs {
  forms: Record<string, any>;
  cache: Record<string, any>;
  Components: {
    components: {
      component: {
        Validator: {
          db: any | null;
          token: any | null;
          form: any | null;
          submission: any | null;
        };
      };
    };
  };

  getToken(): string;
}
