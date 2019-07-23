export const environment = {
    production: true,
    clientId: "Insert here from Azure App Registration",
    tenantId: "Insert here from Azure",
    // Choose if to use simple auth or require endpoint-specific auth.
    UseScopeLevelAuth: false,
    // If using endpoint-specific auth then all users will need to have the following Scope.
    // App Registrations > Expose API, API Permissions. Required as Azure seems to need at least one scope.
    ApplicationScope: "Insert here from Azure App Registration",
    // And need to define AzureIdentifierUri to form the fully qualified Scope name.
    // App Registrations > Manifest
    AzureIdentifierUri: "Insert here from Azure App Registration",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
