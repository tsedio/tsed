import {isFunction, isString} from "@tsed/core";
import type {ModelClassFactory, ModelClassSpecifier, RelationJoin, RelationMapping} from "objection";

export type RelationshipOptsWithThrough = Partial<RelationJoin> & Omit<RelationMapping<any>, "relation" | "join" | "modelClass">;

export type RelationshipOptsWithoutThrough = Omit<RelationshipOptsWithThrough, "through">;

export type RelationshipOpts = (RelationshipOptsWithThrough | RelationshipOptsWithoutThrough) & {type?: ModelClassSpecifier};

export const isRelationshipOptsWithThrough = (opts?: RelationshipOpts): opts is RelationshipOptsWithThrough =>
  opts !== undefined && (<RelationshipOptsWithThrough>opts).through !== undefined;

export const isModelClassFactory = (type?: ModelClassSpecifier): type is ModelClassFactory =>
  type !== undefined && !isString(type) && isFunction(type) && !("prototype" in type);
