/**
 * Proxy class to the Angular 7 HttpClient for Azure Active Directory
 */
import {HttpClient, HttpEvent} from "@angular/common/http";
import {AuthService} from "./AuthService";
import {flatMap, map} from "rxjs/operators";
import {Observable, defer} from "rxjs";

import {environment} from "../../../../environments/environment";

const SCOPE_BASE = environment.AzureIdentifierUri;

const ADD_SCOPE_BASE = (i => {
    if (i.search(SCOPE_BASE) === -1) {
        return SCOPE_BASE + "/" + i;
    } else {
        return i;
    }
});

interface HttpOptions {
    scopes: string[];
}

export class HttpClientService {
    server = undefined;

    constructor(private http: HttpClient, private authService: AuthService) {
        if (!SCOPE_BASE) {
            throw new Error(`Expecting environment.AzureIdentifierUri to be set`);
        }
    }

    setServer(server) {
        this.server = server;
    }

    httpOptions(options: HttpOptions = {scopes: []}): Observable<any> {   // Promise<any> {
        if (!this.server) {
            throw new Error(`httpOptions - server is not defined`);
        }
        let headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": this.server
        };
        // return of(headers);
        console.log(`httpOptions - given scopes before: ${JSON.stringify(options.scopes)}`);
        options.scopes = this.authService.getScopesOrDefault(options.scopes);
        options.scopes = options.scopes.map(ADD_SCOPE_BASE);
        console.log(`httpOptions - given scopes after: ${JSON.stringify(options.scopes)}`);
        // if (! (options.scopes && options.scopes.length > 0)) {
        //     options.scopes = ["user.read"]; // api://translationeditor-test/.default"]; // offline_access api://translationeditor-test/default openid user.read, api://translationeditor-test/tester"];
        // }
        // Make an auth call to Azure AD
        return defer(async () => {
            let bearer;
            // if (!(options.scopes && options.scopes.length > 0)) {
            //     bearer = this.authService.idToken;
            // } else {
            bearer = await this.authService.retrieveToken(options.scopes);
            // }
            // ).subscribe(value => {
            console.log(`bearer value: ${bearer}`);

            headers["Authorization"] = "Bearer " + bearer;
            return {headers};
        });
    }

    /**
     * Perform an HTTPClient GET but with authentication against scopes specified on the REST endpoint this hits
     * @param URL
     * @options - scopesApplied - perform 'preflight' request to get the scopes applied to the endpoint that the user
     * must 'have' in order for them to be authorised.  It doesn't matter if there are no scopes on the endpoint
     * except that it means an unnecessary light-weight call is made to the backend.  If there is a scope and
     * this preflight step is not taken then a 401 unauthorised will be thrown.
     * @returns an observable the same as for httpClient.Get().  Subscribe to it.
     */
    get<T>(URL: string, options?: { scopesApplied: boolean }): Observable<HttpEvent<T>> {
        // First call the HEAD of same endpoint to retrieve the scopes attached to it (eg. the roles users must have)
        // Azure login with that (Dynamic) scope
        // And then call the actual GET with that scope
        if (options && options.scopesApplied) {
            return this.httpOptions()
                .pipe(
                    flatMap(httpHeader => {
                        httpHeader["observe"] = "response"; // to prevent Angular from bypassing response
                        console.log(`httpHeader in flatMap pipe keys: ${JSON.stringify(httpHeader)}`);
                        return this.http.head<T>(URL, httpHeader);
                    }),
                    map(response => {
                        const scopesIn = response["headers"].get("scopes");
                        const scopes = typeof scopesIn === "string" ? JSON.parse(scopesIn) : scopesIn;
                        console.log(`  mscopes: ${JSON.stringify(scopes)}`);
                        return scopes ? scopes.scopes : [];
                    }),
                    flatMap(requestScopes => {
                        // const scopes = requestScopes.map(ADD_SCOPE_BASE);
                        console.log(`  helloWorld observabale - scopes: ${JSON.stringify(requestScopes)}`);
                        return this.httpOptions({scopes: requestScopes});
                    }),
                    flatMap(httpHeader => {
                        return this.http.get<T>(URL, httpHeader);
                    })
                    // ,tap(value => console.log(`tap shows: ${JSON.stringify(value)}`))    // DEBUG
                );

        } else {
            return this.httpOptions()
                .pipe(
                    flatMap(httpHeader => {
                        return this.http.get<T>(URL, httpHeader);
                    })
                );
        }
    }

    /**
     * Perform an HTTPClient POST but with authentication against scopes specified on the REST endpoint this hits
     * @param URL
     * @param body
     * @param options
     * @options - scopesApplied - perform 'preflight' request to get the scopes applied to the endpoint that the user
     * must 'have' in order for them to be authorised.  It doesn't matter if there are no scopes on the endpoint
     * except that it means an unnecessary light-weight call is made to the backend.  If there is a scope and
     * this preflight step is not taken then a 401 unauthorised will be thrown.
     * @returns an observable the same as for httpClient.Get().  Subscribe to it.
     *
     * For Authentication to work, a separate HEAD at same endpoint as the POST needs to exist.
     */
    post<T>(URL: string, body: any, options?: { scopesApplied: boolean }): Observable<HttpEvent<T>> {
        // First call the HEAD of same endpoint to retrieve the scopes attached to it (eg. the roles users must have)
        // Azure login with that (Dynamic) scope
        // And then call the actual POST with that scope
        if (options && options.scopesApplied) {
            return this.httpOptions()
                .pipe(
                    flatMap(httpHeader => {
                        httpHeader["observe"] = "response"; // to prevent Angular from bypassing response
                        console.log(`httpHeader in flatMap pipe keys: ${JSON.stringify(httpHeader)}`);
                        return this.http.head<T>(URL, httpHeader);
                    }),
                    map(response => {
                        const scopesIn = response["headers"].get("scopes");
                        const scopes = typeof scopesIn === "string" ? JSON.parse(scopesIn) : scopesIn;
                        console.log(`  mscopes: ${JSON.stringify(scopes)}`);
                        return scopes ? scopes.scopes : [];
                    }),
                    flatMap(requestScopes => {
                        // const scopes = requestScopes.map(ADD_SCOPE_BASE);
                        console.log(`  helloWorld observabale - scopes: ${JSON.stringify(requestScopes)}`);
                        return this.httpOptions({scopes: requestScopes});
                    }),
                    flatMap(httpHeader => {
                        return this.http.post<T>(URL, body, httpHeader);
                    })
                    // ,tap(value => console.log(`tap shows: ${JSON.stringify(value)}`))    // DEBUG
                );

        } else {
            return this.httpOptions()
                .pipe(
                    flatMap(httpHeader => {
                        return this.http.post<T>(URL, body, httpHeader);
                    })
                );
        }
    }
}
