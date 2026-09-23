import {DMMF} from "@prisma/generator-helper";
import {SourceFile} from "ts-morph";

export interface TransformContext {
  dmmf: DMMF.Document;
  modelsMap: Map<string, DMMF.Model>;
  prismaClientPath: string;
  /**
   * Name (without extension) of the barrel file exported by the Prisma client generator.
   * "index" for prisma-client-js, "client" for the newer prisma-client generator.
   */
  prismaClientEntry: string;
}
