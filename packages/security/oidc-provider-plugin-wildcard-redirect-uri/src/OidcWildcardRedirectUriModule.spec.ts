import {catchError} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {errors, KoaContextWithOIDC} from "oidc-provider";

import {OidcWildcardRedirectUriModule} from "./OidcWildcardRedirectUriModule.js";
import InvalidClientMetadata = errors.InvalidClientMetadata;

describe("WildcardRedirectUriAllowed", () => {
  beforeEach(() =>
    PlatformTest.create({
      oidc: {
        plugins: {
          wildcard: {
            enabled: true
          }
        }
      }
    })
  );
  afterEach(() => PlatformTest.reset());

  describe("$onCreateOIDC()", () => {
    it("should configure the oidc provider", async () => {
      const originalRedirectUriAllowed = vi.fn();
      const originalPostLogoutRedirectUriAllowed = vi.fn();
      const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);
      const provider: any = {
        Client: {
          prototype: {
            redirectUriAllowed: originalRedirectUriAllowed,
            postLogoutRedirectUriAllowed: originalPostLogoutRedirectUriAllowed
          }
        }
      };

      await service.$onCreateOIDC(provider as any);

      expect(provider.Client.prototype.redirectUriAllowed).not.toEqual(originalRedirectUriAllowed);
      expect(provider.Client.prototype.postLogoutRedirectUriAllowed).not.toEqual(originalPostLogoutRedirectUriAllowed);
    });
  });
  describe("$alterOidcConfiguration()", () => {
    it("should alter configuration", async () => {
      const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);
      const config: any = {};

      await service.$alterOidcConfiguration(config);

      expect(config.extraClientMetadata.properties).toEqual(["redirect_uris", "post_logout_redirect_uris"]);
      expect(config.extraClientMetadata.validator).toBeInstanceOf(Function);
    });
  });
  describe("validator()", () => {
    describe("for redirect_uris", () => {
      it("should do nothing if key is not redirect_uris", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);
        service.validator({} as KoaContextWithOIDC, "key", "value");
      });
      it("should throw an error if one of client redirect_uri contains more than one '*'", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() =>
          service.validator({} as KoaContextWithOIDC, "redirect_uris", ["https://*.test.com/callback/*"])
        );

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_redirect_uri");
        expect(error.error_description).toEqual("redirect_uris with a wildcard may only contain a single one");
      });
      it("should throw an error if one of client redirect_uri contains one '*' but not in hostname", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() =>
          service.validator({} as KoaContextWithOIDC, "redirect_uris", ["https://redirect.test.com/callback/*"])
        );

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_redirect_uri");
        expect(error.error_description).toEqual("redirect_uris may only have a wildcard in the hostname");
      });
      it("should throw an error if one of client redirect_uri contains one '*' as hostname prefix", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() => service.validator({} as KoaContextWithOIDC, "redirect_uris", ["https://prefix.*/callback"]));

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_redirect_uri");
        expect(error.error_description).toEqual("redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain");
      });
    });
    describe("for post_logout_redirect_uris", () => {
      it("should do nothing if key is not redirect_uris", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);
        service.validator({} as KoaContextWithOIDC, "key", "value");
      });
      it("should throw an error if one of client post_logout_redirect_uris contains more than one '*'", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() =>
          service.validator({} as KoaContextWithOIDC, "post_logout_redirect_uris", ["https://*.test.com/callback/*"])
        );

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_client_metadata");
        expect(error.error_description).toEqual("post_logout_redirect_uris with a wildcard may only contain a single one");
      });
      it("should throw an error if one of client post_logout_redirect_uris contains one '*' but not in hostname", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() =>
          service.validator({} as KoaContextWithOIDC, "post_logout_redirect_uris", ["https://redirect.test.com/callback/*"])
        );

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_client_metadata");
        expect(error.error_description).toEqual("post_logout_redirect_uris may only have a wildcard in the hostname");
      });
      it("should throw an error if one of client post_logout_redirect_uris contains one '*' as hostname prefix", () => {
        const service = PlatformTest.get<OidcWildcardRedirectUriModule>(OidcWildcardRedirectUriModule);

        const error = catchError<any>(() =>
          service.validator({} as KoaContextWithOIDC, "post_logout_redirect_uris", ["https://prefix.*/callback"])
        );

        expect(error).toBeInstanceOf(InvalidClientMetadata);
        expect(error.message).toEqual("invalid_client_metadata");
        expect(error.error_description).toEqual(
          "post_logout_redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain"
        );
      });
    });
  });
});
