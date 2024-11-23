import {Inject, Injectable, injectable, InjectorService} from "../../index.js";
import {DITest} from "../services/DITest.js";

class Model {}

const SQLITE_DATA_SOURCE = injectable(Symbol.for("SQLITE_DATA_SOURCE"))
  .type("typeorm:datasource")
  .asyncFactory(() => {
    return Promise.resolve({
      id: "sqlite"
    });
  })
  .token();

export abstract class AbstractDao {
  private readonly dao: any;

  protected constructor(
    protected readonly ds: any,
    model: any
  ) {
    this.dao = ds.getRepository(model);
  }

  getRepository(transaction?: any): any {
    return transaction ? transaction.getRepository(this.dao.target) : this.dao;
  }
}

@Injectable()
export class FileDao extends AbstractDao {
  public constructor(@Inject(SQLITE_DATA_SOURCE) protected ds: any) {
    super(ds, Model);
  }
}

describe("DITest", () => {
  describe("create()", () => {
    beforeEach(() =>
      DITest.create({
        imports: [
          {
            token: SQLITE_DATA_SOURCE,
            use: {
              initialize: vi.fn(),
              getRepository: vi.fn().mockReturnValue({
                repository: true
              })
            }
          },
          {
            token: InjectorService, // not possible to override the injector
            use: "test"
          }
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should return a service with pre mocked dependencies", () => {
      const service = DITest.get<FileDao>(FileDao);
      const repository = DITest.get(SQLITE_DATA_SOURCE);

      expect(repository.getRepository).toHaveBeenCalledWith(Model);

      const result = service.getRepository();

      expect(result).toEqual({
        repository: true
      });
    });

    it("should return a service with pre mocked dependencies (invoke)", async () => {
      const service = await DITest.invoke<FileDao>(FileDao);

      const repository = DITest.get(SQLITE_DATA_SOURCE);

      expect(repository.getRepository).toHaveBeenCalledWith(Model);

      const result = service.getRepository();

      expect(result).toEqual({
        repository: true
      });
    });

    it("should return a service with pre mocked dependencies (invoke + mock)", async () => {
      const dao = {
        initialize: vi.fn(),
        getRepository: vi.fn().mockReturnValue({
          repository: false
        })
      };
      const service = await DITest.invoke<FileDao>(FileDao, [
        {
          token: SQLITE_DATA_SOURCE,
          use: dao
        }
      ]);

      const result = service.getRepository();

      expect(dao.getRepository).toHaveBeenCalledWith(Model);
      expect(result).toEqual({
        repository: false
      });
    });
  });
});
