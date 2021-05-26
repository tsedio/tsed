import {Groups, Required, RequiredGroups} from "@tsed/schema";

@Groups<User>({
  // will generate UserCreate
  create: ["firstName", "lastName", "email", "password"],
  // will generate UserUpdate
  update: ["id", "firstName", "lastName", "email"],
  // will generate UserChangePassword
  changePassword: ["id", "password", "newPassword"]
})
export class User {
  @Required()
  id: string;

  @RequiredGroups("creation")
  firstName: string;

  @RequiredGroups("creation")
  lastName: string;

  @RequiredGroups("creation")
  email: string;

  @RequiredGroups("create", "changePassword")
  password: string;

  @RequiredGroups("changePassword")
  newPassword: string;
}
