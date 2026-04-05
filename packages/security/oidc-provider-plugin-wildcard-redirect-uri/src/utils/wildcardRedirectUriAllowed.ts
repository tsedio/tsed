// @ts-ignore
import wildcard from "wildcard";

const hasWildcardHost = (redirectUri: string) => {
  const {hostname} = new URL(redirectUri);
  return hostname.includes("*");
};

const wildcardMatches = (redirectUri: string, wildcardUri: string) => !!wildcard(wildcardUri, redirectUri);

export function wildcardRedirectUriAllowed(
  originalRedirectUriAllowed: any,
  redirectUriOrPostLogoutRedirectUri: "redirectUris" | "postLogoutRedirectUris"
) {
  return function (
    this: {
      redirectUris?: string[];
      postLogoutRedirectUris?: string[];
    },
    redirectUri: string
  ) {
    const uris = this[redirectUriOrPostLogoutRedirectUri] || [];

    if (uris.some(hasWildcardHost)) {
      const wildcardUris = uris.filter(hasWildcardHost);
      return wildcardUris.some(wildcardMatches.bind(undefined, redirectUri)) || originalRedirectUriAllowed.call(this, redirectUri);
    }
    return originalRedirectUriAllowed.call(this, redirectUri);
  };
}
