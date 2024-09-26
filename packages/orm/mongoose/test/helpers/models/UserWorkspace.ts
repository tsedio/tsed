import {CollectionOf, Property} from "@tsed/schema";
import type {Types} from "mongoose";

import type {MongooseModel} from "../../../src/index.js";
import {Model, ObjectID, Ref, Schema} from "../../../src/index.js";

@Model()
export class Workspace {
  @ObjectID("id")
  _id: string;

  @Property()
  name: string;
}

@Schema()
export class MyWorkspace {
  @Ref(Workspace)
  workspaceId: Ref<Workspace>;

  @Property()
  title: string;
}

@Model()
export class UserWorkspace {
  @CollectionOf(MyWorkspace)
  workspaces: MyWorkspace[];
}

export type UserModel = MongooseModel<UserWorkspace & {workspaces: Types.Array<MyWorkspace>}>;
export type WorkspaceModel = MongooseModel<Workspace>;
