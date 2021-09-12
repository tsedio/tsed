export interface FormioDecodedToken extends Record<string, unknown> {
  user: {
    _id: string;
  };
  form: {
    _id: string;
  };
}

export interface FormioPayloadToken {
  token: string;
  decoded: FormioDecodedToken;
}
