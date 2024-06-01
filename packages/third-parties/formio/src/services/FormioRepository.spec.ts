import {Injectable, PlatformTest} from "@tsed/common";
import {FormioDatabase} from "./FormioDatabase.js";
import {FormioRepository} from "./FormioRepository.js";

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
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        saveSubmission: jest.fn().mockImplementation((o) => o)
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

      expect(result).toEqual({
        data: {
          label: "label"
        },
        form: "id"
      });
      expect(database.saveSubmission).toHaveBeenCalledWith({
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
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        getSubmissions: jest.fn().mockResolvedValue([])
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submissions = await service.getSubmissions();

      expect(submissions).toEqual([]);
      expect(database.formModel.findOne).toHaveBeenCalledWith({
        name: {
          $eq: "package"
        }
      });
      expect(database.getSubmissions).toHaveBeenCalledWith({form: "id"});
    });
  });
  describe("findOneSubmission()", () => {
    it("should find on submission", async () => {
      const database = {
        formModel: {
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        submissionModel: {
          findOne: jest.fn().mockResolvedValue({_id: "id"})
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submission = await service.findOneSubmission({});

      expect(submission).toEqual({_id: "id"});
      expect(database.formModel.findOne).toHaveBeenCalledWith({
        name: {
          $eq: "package"
        }
      });
      expect(database.submissionModel.findOne).toHaveBeenCalledWith({deleted: null, form: "id"});
    });
  });
});
