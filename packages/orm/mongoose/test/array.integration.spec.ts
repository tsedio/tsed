import {DITest} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {MyWorkspace, UserModel, UserWorkspace, Workspace, WorkspaceModel} from "./helpers/models/UserWorkspace.js";

describe("Mongoose", () => {
  describe("Array models", () => {
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it("should run pre and post hook", async () => {
      const userModel = DITest.get<UserModel>(UserWorkspace);
      const workspaceModel = DITest.get<WorkspaceModel>(Workspace);

      // GIVEN
      const user = new userModel();
      const workspace = new workspaceModel();
      workspace.name = "test";

      await workspace.save();

      const myWorkspace = new MyWorkspace();
      myWorkspace.workspaceId = workspace._id;
      myWorkspace.title = "MyTest";

      user.workspaces.push(myWorkspace);

      // WHEN
      await user.save();
      const result = await userModel.find();

      // THEN

      expect(serialize(result[0], {type: UserWorkspace})).toEqual({
        workspaces: [
          {
            title: "MyTest",
            workspaceId: result[0].workspaces[0].workspaceId.toString()
          }
        ]
      });
      expect(serialize(result, {type: UserWorkspace, collectionType: Array})).toEqual([
        {
          workspaces: [
            {
              title: "MyTest",
              workspaceId: result[0].workspaces[0].workspaceId.toString()
            }
          ]
        }
      ]);
      expect(result.length).toBe(1);
      expect(result[0].workspaces[0].title).toEqual("MyTest");
      expect(result[0].workspaces[0].workspaceId).toEqual(workspace._id);

      // WHEN
      user.workspaces.pull(result[0].workspaces[0]);

      await user.save();

      // THEN
      const result2 = await userModel.find();
      expect(result2.length).toBe(1);
      expect(result2[0].workspaces.length).toEqual(0);
    });
  });
});
