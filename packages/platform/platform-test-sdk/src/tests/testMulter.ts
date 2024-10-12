import {Controller} from "@tsed/di";
import {MulterOptions, MultipartFile, PlatformMulterFile} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {CollectionOf, Post, Property, Required, Status} from "@tsed/schema";
import multer, {FileFilterCallback} from "multer";
import {dirname, join} from "path";
import readPkgUp from "read-pkg-up";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

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

const fileFilterStub = vi.fn();
const fileFilter = (req: any, file: PlatformMulterFile, callback: FileFilterCallback) => {
  fileFilterStub();
  callback(null, true);
};

function getFileConfig(): any {
  return {
    storage: multer.diskStorage({
      destination: (req: any, _fileItem, cb) => {
        const path = `${rootDir}/../.tmp`;
        cb(null, path);
      }
    }),
    fileFilter
  };
}

@Controller("/multer")
export class TestMulterController {
  @Post("/scenario-1")
  @Status(201)
  @MulterOptions({dest: `${rootDir}/../.tmp`})
  uploadWithName(@Required() @MultipartFile("media") media: PlatformMulterFile) {
    return media.originalname;
  }

  @Post("/scenario-2")
  @Status(201)
  @MulterOptions({dest: `${rootDir}/../.tmp`})
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

export function testMulter(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  const buffer = Buffer.from("test content");

  const pkg = readPkgUp.sync({
    cwd: import.meta.dirname
  });
  const rootDir = join(dirname(pkg?.path || ""), "src");

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestMulterController]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  beforeAll(() => {
    vi.resetAllMocks();
  });
  describe("Scenario 1: POST /rest/multer/scenario-1", () => {
    it("should upload file with multer", async () => {
      const result = await request.post("/rest/multer/scenario-1").attach("media", `${rootDir}/data/file.txt`).expect(201);

      expect(result.text).toEqual("file.txt");
    });

    it("should throw an exception when there is no file", async () => {
      const result = await request.post("/rest/multer/scenario-1").expect(400);

      expect(result.body).toEqual({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.files.media.0\".\nIt should have required parameter 'media.0'",
        status: 400,
        errors: [
          {
            dataPath: ".media.0",
            requestPath: "files",
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
        .attach("media", `${rootDir}/data/file.txt`)
        .field({
          form_id: "form_id"
        })
        .expect(201);

      expect(result.body).toEqual({file: "file.txt", formId: "form_id"});
    });
  });
  describe("Scenario 3: POST /rest/multer/scenario-3", () => {
    it("should upload file with multer", async () => {
      const result = await request.post("/rest/multer/scenario-3").attach("media", `${rootDir}/data/file.txt`).field({}).expect(201);

      expect(result.body).toEqual({
        file: "file.txt"
      });

      // filterFilter is called
      expect(fileFilterStub).toBeCalled();
    });
  });
}
