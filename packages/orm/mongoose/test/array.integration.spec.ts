import {serialize} from "@tsed/json-mapper";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {MyWorkspace, UserModel, UserWorkspace, Workspace, WorkspaceModel} from "./helpers/models/UserWorkspace";
import {Server} from "./helpers/Server";

describe("Mongoose", () => {
  describe("Array models", () => {
    beforeEach(TestMongooseContext.bootstrap(Server));
    afterEach(TestMongooseContext.clearDatabase);
    afterEach(TestMongooseContext.reset);

    it("should run pre and post hook", async () => {
      const userModel = TestMongooseContext.get<UserModel>(UserWorkspace);
      const workspaceModel = TestMongooseContext.get<WorkspaceModel>(Workspace);

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

      expect(serialize(result[0], {type: UserWorkspace})).to.deep.eq({
        workspaces: [
          {
            title: "MyTest",
            workspaceId: result[0].workspaces[0].workspaceId.toString()
          }
        ]
      });
      expect(serialize(result, {type: UserWorkspace, collectionType: Array})).to.deep.eq([
        {
          workspaces: [
            {
              title: "MyTest",
              workspaceId: result[0].workspaces[0].workspaceId.toString()
            }
          ]
        }
      ]);
      expect(result.length).to.equal(1);
      expect(result[0].workspaces[0].title).to.deep.equal("MyTest");
      expect(result[0].workspaces[0].workspaceId).to.deep.equal(workspace._id);

      // WHEN
      user.workspaces.pull(result[0].workspaces[0]);

      await user.save();

      // THEN
      const result2 = await userModel.find();
      expect(result2.length).to.equal(1);
      expect(result2[0].workspaces.length).to.deep.equal(0);
    });
  });
});
