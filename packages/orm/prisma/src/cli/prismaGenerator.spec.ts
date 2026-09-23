import {GeneratorOptions} from "@prisma/generator-helper";
import {resolveClientGenerator} from "./prismaGenerator.js";

function otherGenerator(provider: string, output?: string): GeneratorOptions["otherGenerators"][number] {
  return {
    provider: {fromEnvVar: null, value: provider},
    output: output ? {fromEnvVar: null, value: output} : null
  } as unknown as GeneratorOptions["otherGenerators"][number];
}

describe("resolveClientGenerator", () => {
  it("should resolve the output and entry file of a prisma-client generator", () => {
    const result = resolveClientGenerator([otherGenerator("prisma-client", "/project/generated/prisma")]);

    expect(result).toEqual({output: "/project/generated/prisma", entry: "client"});
  });

  it("should resolve the output and entry file of a prisma-client-js generator", () => {
    const result = resolveClientGenerator([otherGenerator("prisma-client-js", "/project/generated/client")]);

    expect(result).toEqual({output: "/project/generated/client", entry: "index"});
  });

  it("should throw an explicit error when no compatible client generator is configured", () => {
    expect(() => resolveClientGenerator([otherGenerator("some-other-generator")])).toThrow(
      /requires a Prisma client generator \("prisma-client" or "prisma-client-js"\)/
    );
  });

  it("should throw an explicit error when the client generator has no explicit output", () => {
    expect(() => resolveClientGenerator([otherGenerator("prisma-client")])).toThrow(
      /The "prisma-client" generator must declare an explicit "output" path/
    );
  });
});
