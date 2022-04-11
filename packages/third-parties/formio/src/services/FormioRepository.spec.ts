import {Injectable, PlatformTest} from "@tsed/common";
import {FormioDatabase} from "@tsed/formio";
import {FormioRepository} from "./FormioRepository";
import sinon from "sinon";
import {expect} from "chai";

@Injectable()
class PackagesRepository extends FormioRepository {
  formName = "package";
}

describe("FormioRepository", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("saveSubmission()", () => {
    it("should create submission", async () => {
      const database = {
        formModel: {
          findOne: sinon.stub().resolves({
            _id: "id"
          })
        },
        saveSubmission: sinon.stub().callsFake((o) => o)
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const result = await service.saveSubmission({
        data: {
          label: "label"
        }
      });

      expect(result).to.deep.eq({
        data: {
          label: "label"
        },
        form: "id"
      });
      expect(database.saveSubmission).to.have.been.calledWithExactly({
        data: {
          label: "label"
        },
        form: "id"
      });
    });
  });
  describe("getSubmissions()", () => {
    it("should get all saved submissions", async () => {
      const database = {
        formModel: {
          findOne: sinon.stub().resolves({
            _id: "id"
          })
        },
        getSubmissions: sinon.stub().resolves([])
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submissions = await service.getSubmissions();

      expect(submissions).to.deep.eq([]);
      expect(database.formModel.findOne).to.have.been.calledWithExactly({
        name: {
          $eq: "package"
        }
      });
      expect(database.getSubmissions).to.have.been.calledWithExactly({form: "id"});
    });
  });
  describe("findOneSubmission()", () => {
    it("should find on submission", async () => {
      const database = {
        formModel: {
          findOne: sinon.stub().resolves({
            _id: "id"
          })
        },
        submissionModel: {
          findOne: sinon.stub().resolves({_id: "id"})
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submission = await service.findOneSubmission({});

      expect(submission).to.deep.equal({_id: "id"});
      expect(database.formModel.findOne).to.have.been.calledWithExactly({
        name: {
          $eq: "package"
        }
      });
      expect(database.submissionModel.findOne).to.have.been.calledWithExactly({deleted: null, form: "id"});
    });
  });
});
