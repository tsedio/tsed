import {Property, PropertyType} from "@tsed/common";
import {Model, MongooseModel, ObjectID, Ref, Schema} from "@tsed/mongoose";
import {Types} from "mongoose";

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
  @PropertyType(MyWorkspace)
  workspaces: MyWorkspace[];
}

export type UserModel = MongooseModel<UserWorkspace & {workspaces: Types.Array<MyWorkspace>}>;
export type WorkspaceModel = MongooseModel<Workspace>;
