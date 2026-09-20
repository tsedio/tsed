import {getMongoConnectionOptions} from "./ContainerUtils.js";

describe("getMongoConnectionOptions", () => {
  beforeAll(() => {
    process.env.MONGO_URL = "mongodb://localhost:27017";
  });

  it("should generate unique database urls", () => {
    const urls = Array.from({length: 50}, () => getMongoConnectionOptions().url);

    expect(new Set(urls).size).toEqual(urls.length);
    expect(urls[0]).toContain("mongodb://localhost:27017/db-test-");
  });

  it("should keep the given id and dbName", () => {
    const options = getMongoConnectionOptions("custom-id", {dbName: "users"});

    expect(options.id).toEqual("custom-id");
    expect(options.url).toContain("mongodb://localhost:27017/users-");
    expect(options.connectionOptions.directConnection).toEqual(true);
  });
});
