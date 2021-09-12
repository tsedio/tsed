export interface FormioErrors {
  app: {
    ESETTINGSLOAD: "Cannot load app settings.";
    EDBCONFIG: "Database settings is missing.";
    EDBHOST: "Invalid SQL Host.";
  };
  db: {
    EINVQUERY: "Invalid query.";
    EDBCONN: "Connection error.";
    EQUERY: "Query request error.";
  };
  emailer: {
    ENOTRANSP: "Cannot get emailer transports.";
    ESENDMAIL: "Email sending failed.";
    ESUBPARAMS: "Failed to get substitution parameters.";
  };
  cache: {
    EFORMLOAD: "Cannot load form.";
  };
  form: {
    ENOFORM: "Form not found.";
  };
  auth: {
    EAUTH: "Authentication failed.";
    EPASSFIELD: "Invalid password field.";
    EPASSRESET: "Unable to change password.";
    ERESETTOKEN: "Invalid reset password token.";
    ENOPASSP: "No password provided.";
    ELOGINCOUNT: "Unable to update login count.";
  };
  submission: {
    ENOSUB: "Submission not found.";
    ESUBLOAD: "Cannot load submission.";
    ESUBSAVE: "Cannot save submission.";
  };
  user: {
    ENOUSER: "User not found.";
    ENONAMEP: "No user name provided.";
  };
  role: {
    EROLESLOAD: "Cannot load the Roles.";
    ENOROLE: "Role not found.";
    EROLELOAD: "Cannot load role.";
    EROLEEXIST: "Provided role already exists.";
  };
  request: {
    EREQRECUR: "Too many recursive requests.";
  };
  resource: {
    ENOIDP: "Resource id is missing.";
    ENOHANDLER: "Resource handler not found.";
  };
}
