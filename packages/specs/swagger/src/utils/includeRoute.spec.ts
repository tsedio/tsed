import {ControllerProvider} from "@tsed/common";
import {Hidden} from "@tsed/schema";
import {Docs} from "@tsed/swagger";
import {includeRoute} from "./includeRoute";

@Hidden()
class HiddenCtrl {}

@Docs("test")
class DocsCtrl {}

class PlainCtrl {}

describe("includeRoute", () => {
  it("should return false if controller has hidden decorator", () => {
    const provider = new ControllerProvider(HiddenCtrl);
    expect(
      includeRoute("/test", provider, {
        path: "/swagger"
      })
    ).toBe(false);
  });

  it("should return false if controller docs does not include doc", () => {
    const provider = new ControllerProvider(DocsCtrl);
    expect(
      includeRoute("/test", provider, {
        path: "/swagger",
        doc: "notmatch"
      })
    ).toBe(false);
  });

  it("should return true if controller docs include doc", () => {
    const provider = new ControllerProvider(DocsCtrl);
    expect(
      includeRoute("/test", provider, {
        path: "/swagger",
        doc: "test"
      })
    ).toBe(true);
  });

  it("should return true if patternMatch matches to route", () => {
    const provider = new ControllerProvider(PlainCtrl);
    expect(
      includeRoute("/should/match", provider, {
        path: "/swagger",
        pathPatterns: ["/should/**"]
      })
    ).toBe(true);
  });

  it("should return false if patternMatch does not match to route", () => {
    const provider = new ControllerProvider(PlainCtrl);
    expect(
      includeRoute("/shouldnot/match", provider, {
        path: "/swagger",
        pathPatterns: ["/notmatch/**"]
      })
    ).toBe(false);
  });

  it("should return false if patternMatch is negation and matches to route", () => {
    const provider = new ControllerProvider(PlainCtrl);
    expect(
      includeRoute("/should/match", provider, {
        path: "/swagger",
        pathPatterns: ["!/should/**"]
      })
    ).toBe(false);
  });

  it("should return true if neither doc nor pathPattern is not defined", () => {
    const provider = new ControllerProvider(PlainCtrl);
    expect(
      includeRoute("/test", provider, {
        path: "/swagger"
      })
    ).toBe(true);
  });

  it("should return true if doc and pathPattern defined and only doc matches", () => {
    const provider = new ControllerProvider(DocsCtrl);
    expect(
      includeRoute("/shouldnot/match", provider, {
        path: "/swagger",
        doc: "test",
        pathPatterns: ["/notmatch/**"]
      })
    ).toBe(true);
  });

  it("should return true if doc and pathPattern defined and only pathPattern matches", () => {
    const provider = new ControllerProvider(DocsCtrl);
    expect(
      includeRoute("/should/match", provider, {
        path: "/swagger",
        doc: "nomatch",
        pathPatterns: ["/should/**"]
      })
    ).toBe(true);
  });
});
