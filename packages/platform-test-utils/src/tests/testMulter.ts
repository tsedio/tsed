import {BodyParams, Controller, MulterOptions, MultipartFile, PlatformMulterFile, PlatformTest, Post} from "@tsed/common";
import {CollectionOf, Property, Required, Status} from "@tsed/schema";
import {expect} from "chai";
import * as SuperTest from "supertest";
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
  uploadWithPayload(
    @MultipartFile("media") media: PlatformMulterFile,
    @BodyParams("form_id") formId: string,
    @BodyParams("event") event: Event
  ) {
    return {
      file: media.originalname,
      formId,
      event
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
}
