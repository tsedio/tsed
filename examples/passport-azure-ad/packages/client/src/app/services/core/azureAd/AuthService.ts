import {Injectable} from "@angular/core";
import {Logger, LogLevel, UserAgentApplication} from "msal";
import {ToasterService} from "angular2-toaster";
import {AuthenticationParameters} from "msal/src/AuthenticationParameters";
import {environment} from "../../../../environments/environment";

const Uri = window.location.href;

/**
 * Azure Auth using Microsoft Auth Login
 *
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
 *
 * Roles to be setup as per
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-enterprise-app-role-management
 *
 * Then add the roles as claims to the scopes sent to acquireTokenSilent() in retrieveToken() below.
 *
 * Auth information for your tennant can be found at
 * https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration
 *
 * ---------
 * NOTE: Scopes used in entirety must be defined in server/src/Server.ts > scopes constant
 */
@Injectable()
export class AuthService {
    private msal = null;
    idToken;
    clientId = environment.clientId;
    tenantId = environment.tenantId;
    applicationScope = environment.ApplicationScope;

    constructor(private toast: ToasterService) {
        if (!this.applicationScope) {
            throw new Error(`Expecting environment.ApplicationExecScope to be set`);
        }
    }

    private async setup(): Promise<void> {
        return new Promise(async (resolve) => {

            const loggerCallback = (logLevel, message, containsPii) => {
                console.log(`Auth: [${logLevel} ${message}`);
            };
            const singleMessage = (location) => {
                return (message) => {
                    console.log(`Auth - ${location}: ${message}`);
                };
            };
            const logger = new Logger(
                loggerCallback,
                {correlationId: "1234", level: LogLevel.Info, piiLoggingEnabled: true});

            const redirectUri = "" + Uri + (Uri.substring(Uri.length - 1, Uri.length) === "/" ? "login" : "/login");

            console.log(`redirectUri : ${Uri}, ${redirectUri}, ${Uri.substring(Uri.length - 1, Uri.length)}`);
            this.msal = new UserAgentApplication(
                {
                    auth: {
                        clientId: this.clientId,
                        authority: `https://login.microsoftonline.com/${this.tenantId}`,
                        redirectUri
                    },
                    cache: {
                        cacheLocation: "localStorage",
                        storeAuthStateInCookie: true
                    },
                    system: {
                        logger
                    }
                }
            );

            console.log(`client setup - msal: ${JSON.stringify(this.msal)}`);
            resolve();
        });
    }

    /**
     * Initial sign in to Azure AD.  It returns a tokenId that is used (internally in msal.js though I maintain a copy)
     * to create the subsequent authTokens.
     */
    async signIn() {
        return new Promise(async (resolve, reject) => {
            if (!this.msal) {
                await this.setup();
            }
            const scopes: AuthenticationParameters = {scopes: ["user.read"]};   // api://translationeditor-test/ted.translations.search']};
            this.msal.loginPopup(scopes).then(authResponse => {
                    this.idToken = authResponse.idToken.rawIdToken;
                    console.log(`loginPopup - idToken: ${JSON.stringify(this.idToken)}`);
                    return resolve(this.idToken);
                },
                error => {
                    const msg = `error from loginPopup: ${error}`;
                    console.error(msg);
                    this.toast.pop("error", "sign in", msg);
                    return reject(error);
                });
        });
    }

    /**
     * Retrieve an authToken to be used to pass to the backend API and verified using passport-azure-ad.
     *
     * @param scopes to apply.  At least one is needed.
     */
    async retrieveToken(scopes: string[] = []): Promise<string> {
        return new Promise(async (resolve, reject) => {

            // if the user is already logged in you can acquire a token, if not log them in first
            if (!this.msal && !this.msal.getAccount()) {
                await this.signIn();
            }
            if (! environment.UseScopeLevelAuth) {
                resolve(this.idToken);
            }
            // const allScopes: AuthenticationParameters = {scopes: ""};   // "https://graph.microsoft.com/Calendar.Read", ...scopes]}; // , "api://translationeditor-test/tester", ...scopes]};
            const allScopes: AuthenticationParameters = {scopes: scopes};
            console.log(`Auth - Sign in with scopes: ${JSON.stringify(allScopes)}`);
            return this.msal.acquireTokenSilent(allScopes)
                .then(authResponse => {
                    const token = authResponse.accessToken;
                    console.log(`acquireTokenSilent- accessToken: ${token}`);
                    if (this.tokenIsExpired(authResponse.expiresOn)) {
                        // I don't know why this happens but force the full login to happen again
                        this.msal = null;
                        return this.retrieveToken();
                    }
                    return resolve(token);
                })
                .catch(error => {
                    console.error(`Caught acquireTokenSilent error: ${error}`);
                    return this.msal.acquireTokenPopup(allScopes)
                        .then(authResponse => {
                            const token = authResponse.accessToken;
                            console.log(`acquireTokenPopup- accessToken: ${token}`);
                            return resolve(token);
                        })
                        .catch(err => {
                            const msg = `error from acquireTokenPopup: ${err}`;
                            console.error(msg);
                            this.toast.pop("error", "Acquire API Token", msg);
                            return reject(error);
                        });
                });
        });
    }

    /**
     * We seem to require at least one scope to get an AuthToken.  And the best I can work out is it needs to be
     * defined per application - Azure > App Registrations > app_one > Expose API, API Permissions
     *
     * @param scope is any existing, and in which case we just return this instead of the 'default'
     */
    getScopesOrDefault(scope: string[]): string[] {
        if (!scope || scope.length === 0) {
            return [this.applicationScope];
        }
        return scope;
    }

    private tokenIsExpired(expiresOn: string): boolean {
        const now = new Date();
        const expiresOnDate = new Date(expiresOn);
        const expired = now.getTime() - expiresOnDate.getTime() > 0;

        console.log(`Check if tokenIsExpired - expiry: ${expiresOn} date: ${new Date()} - has expired?: ${expired} (Code for this TBD)`);
        return false;   // Don't want to do anything until fully tested and code written
    }
}
