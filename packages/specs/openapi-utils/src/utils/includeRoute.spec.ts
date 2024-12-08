import {ControllerProvider} from "@tsed/di";
import {Hidden} from "@tsed/schema";

import {Docs} from "../decorators/docs.js";
import {includeRoute} from "./includeRoute.js";

@Hidden()
class HiddenCtrl {}

@Docs("test")
class DocsCtrl {}

class PlainCtrl {}

describe("includeRoute", () => {
  it.each([
    {
      label: "a simple configuration + HiddenCtrl are given",
      expected: false,
      route: "/test",
      conf: {
        path: "/swagger"
      },
      controller: HiddenCtrl
    },
    {
      label: "a simple configuration + PlainCtrl are given",
      expected: true,
      route: "/test",
      conf: {
        path: "/swagger"
      },
      controller: PlainCtrl
    },
    {
      label: "a given configuration with doc property doesn't match route",
      expected: false,
      route: "/test",
      conf: {
        path: "/swagger",
        doc: "notmatch"
      },
      controller: DocsCtrl
    },
    {
      label: "a given configuration with doc property matching route",
      expected: true,
      route: "/test",
      conf: {
        path: "/swagger",
        doc: "test"
      },
      controller: DocsCtrl
    },
    {
      label: "a given configuration with pathPatterns property matching route",
      expected: true,
      route: "/should/match",
      conf: {
        path: "/swagger",
        pathPatterns: ["/should/**"]
      },
      controller: PlainCtrl
    },
    {
      label: "a given configuration with pathPatterns property doesn't match route",
      expected: false,
      route: "/shouldnot/match",
      conf: {
        path: "/swagger",
        pathPatterns: ["/notmatch/**"]
      },
      controller: PlainCtrl
    },
    {
      label: "a given configuration with pathPatterns property doesn't match route - negation on pathPatterns",
      expected: false,
      route: "/should/match",
      conf: {
        path: "/swagger",
        pathPatterns: ["!/should/**"]
      },
      controller: PlainCtrl
    },
    {
      label: "a given configuration with pathPatterns/doc properties but only doc match",
      expected: true,
      route: "/shouldnot/match",
      conf: {
        path: "/swagger",
        doc: "test",
        pathPatterns: ["/notmatch/**"]
      },
      controller: DocsCtrl
    },
    {
      label: "a given configuration with pathPatterns/doc properties but only pathPattern match",
      expected: true,
      route: "/should/match",
      conf: {
        path: "/swagger",
        doc: "nomatch",
        pathPatterns: ["/should/**"]
      },
      controller: DocsCtrl
    }
  ])("should return $expected when $label ($route)", ({expected, conf, route, controller}) => {
    const provider = new ControllerProvider(controller);
    expect(includeRoute(route, provider, conf as any)).toBe(expected);
  });
});
