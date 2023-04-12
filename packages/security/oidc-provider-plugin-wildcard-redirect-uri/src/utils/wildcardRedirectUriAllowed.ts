// @ts-ignore
import wildcard from "wildcard";

const hasWildcardHost = (redirectUri: string) => {
  const {hostname} = new URL(redirectUri);
  return hostname.includes("*");
};

const wildcardMatches = (redirectUri: string, wildcardUri: string) => !!wildcard(wildcardUri, redirectUri);

export function wildcardRedirectUriAllowed(originalRedirectUriAllowed: any) {
  return function (redirectUri: string) {
    if (this.redirectUris.some(hasWildcardHost)) {
      const wildcardUris = this.redirectUris.filter(hasWildcardHost);
      return wildcardUris.some(wildcardMatches.bind(undefined, redirectUri)) || originalRedirectUriAllowed.call(this, redirectUri);
    }
    return originalRedirectUriAllowed.call(this, redirectUri);
  };
}
