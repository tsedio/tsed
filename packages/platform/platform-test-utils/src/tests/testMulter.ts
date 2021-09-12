import {BodyParams, Controller, MulterOptions, MultipartFile, PlatformMulterFile, PlatformTest, Post} from "@tsed/common";
import {CollectionOf, Property, Required, Status} from "@tsed/schema";
import {expect} from "chai";
import {Request} from "express";
import multer, {FileFilterCallback} from "multer";
import Sinon from "sinon";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export class Task {
  @Property()
  id: string;

  @Property()
  title: string;
}

export class Event {
  @Property()
  @Required()
  id: string;

  @CollectionOf(Task)
  tasks: Task[];
}

const fileFilter = Sinon.stub().callsFake((req: Request, file: PlatformMulterFile, callback: FileFilterCallback) => {
  callback(null, true);
});

function getFileConfig(): any {
  return {
    storage: multer.diskStorage({
      destination: (req: Express.Request, _fileItem, cb) => {
        const path = `${__dirname}/../.tmp`;
        cb(null, path);
      }
    }),
    fileFilter: fileFilter
  };
}

@Controller("/multer")
export class TestMulterController {
  @Post("/scenario-1")
  @Status(201)
  @MulterOptions({dest: `${__dirname}/../.tmp`})
  uploadWithName(@Required() @MultipartFile("media") media: PlatformMulterFile) {
    return media.originalname;
  }

  @Post("/scenario-2")
  @Status(201)
  @MulterOptions({dest: `${__dirname}/../.tmp`})
  uploadWithPayload(@MultipartFile("media") media: PlatformMulterFile, @BodyParams("form_id") formId: string) {
    return {
      file: media.originalname,
      formId
    };
  }

  @Post("/scenario-3")
  @Status(201)
  @MulterOptions(getFileConfig())
  uploadWithOptions(@MultipartFile("media") media: PlatformMulterFile) {
    return {
      file: media.originalname
    };
  }
}

export function testMulter(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestMulterController]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  before(() => fileFilter.resetHistory());
  describe("Scenario 1: POST /rest/multer/scenario-1", () => {
    it("should upload file with multer", async () => {
      const result = await request.post("/rest/multer/scenario-1").attach("media", `${__dirname}/../data/file.txt`).expect(201);

      expect(result.text).to.eq("file.txt");
    });

    it("should throw an exception when there is no file", async () => {
      const result = await request.post("/rest/multer/scenario-1").expect(400);

      expect(result.body).to.deep.eq({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.files.media.0\".\nIt should have required parameter 'media.0'",
        status: 400,
        errors: [
          {
            dataPath: "",
            keyword: "required",
            message: "It should have required parameter 'media.0'",
            modelName: "files",
            params: {missingProperty: "media.0"},
            schemaPath: "#/required"
          }
        ]
      });
    });
  });
  describe("Scenario 2: POST /rest/multer/scenario-2", () => {
    it("should upload file with multer", async () => {
      const result = await request
        .post("/rest/multer/scenario-2")
        .attach("media", `${__dirname}/../data/file.txt`)
        .field({
          form_id: "form_id"
        })
        .expect(201);

      expect(result.body).to.deep.eq({file: "file.txt", formId: "form_id"});
    });
  });
  describe("Scenario 3: POST /rest/multer/scenario-3", () => {
    it("should upload file with multer", async () => {
      const result = await request.post("/rest/multer/scenario-3").attach("media", `${__dirname}/../data/file.txt`).expect(201);

      expect(result.body).to.deep.eq({
        file: "file.txt"
      });

      // filterFilter is called
      return expect(fileFilter).to.have.been.called;
    });
  });
}
