import type {DMMF} from "@prisma/generator-helper";
import {SourceFile} from "ts-morph";

export interface TransformContext {
  dmmf: DMMF.Document;
  modelsMap: Map<string, DMMF.Model>;
}
