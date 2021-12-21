import {DBContext, MikroOrmRegistry} from "../services";
import {TransactionalInterceptor} from "./TransactionalInterceptor";
import {anything, instance, mock, reset, spy, verify, when} from "ts-mockito";
import {InterceptorContext, InterceptorNext} from "@tsed/common";
import {EntityManager, MikroORM, OptimisticLockError} from "@mikro-orm/core";

describe("TransactionalInterceptor", () => {
  const mikroOrmRegistryMock = mock<MikroOrmRegistry>();
  const mikroOrm = mock(MikroORM);
  const entityManagerMock = mock(EntityManager);
  const dbContext = new DBContext();

  let transactionalInterceptor!: TransactionalInterceptor;

  afterEach(() => reset<MikroOrmRegistry | MikroORM | EntityManager>(mikroOrmRegistryMock, mikroOrm, entityManagerMock));
  beforeEach(() => {
    transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext);
    when(mikroOrm.em).thenReturn(instance(entityManagerMock));
    when(entityManagerMock.fork(anything(), anything())).thenReturn(instance(entityManagerMock));
  });

  describe("intercept", () => {
    it("should run within a new context", async () => {
      // arrange
      const context = {} as InterceptorContext;
      const next = (() => {
        // noop
      }) as InterceptorNext;
      when(mikroOrmRegistryMock.get(anything())).thenReturn(instance(mikroOrm));
      when(entityManagerMock.name).thenReturn("default");

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(mikroOrmRegistryMock.get(anything())).once();
      verify(entityManagerMock.fork(anything(), anything())).once();
      verify(entityManagerMock.flush()).once();
    });

    it("should throw an optimistic lock exception immediately if no retry strategy", async () => {
      // arrange
      const context = {} as InterceptorContext;
      const next = (() => {
        // noop
      }) as InterceptorNext;
      when(mikroOrmRegistryMock.get(anything())).thenReturn(instance(mikroOrm));
      when(entityManagerMock.name).thenReturn("default");
      when(entityManagerMock.flush()).thenReject(OptimisticLockError.lockFailed("Lock"));

      // act
      await expect(transactionalInterceptor.intercept(context, next)).rejects.toThrowError("Lock");

      // assert
      verify(mikroOrmRegistryMock.get(anything())).once();
      verify(entityManagerMock.fork(anything(), anything())).once();
      verify(entityManagerMock.flush()).times(1);
    });

    it("should run under existing context", async () => {
      // arrange
      const spiedDbContext = spy(dbContext);
      const existingCtx = new Map([["default", instance(entityManagerMock)]]);

      when(spiedDbContext.getContext()).thenReturn(existingCtx);

      const context = {} as InterceptorContext;
      const next = (() => {
        // noop
      }) as InterceptorNext;

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(mikroOrmRegistryMock.get(anything())).never();
      verify(entityManagerMock.fork(anything(), anything())).never();
      verify(entityManagerMock.flush()).never();
    });

    it("should run under existing context using different connection", async () => {
      // arrange
      const spiedDbContext = spy(dbContext);
      const existingCtx = new Map([["default", instance(entityManagerMock)]]);

      when(spiedDbContext.getContext()).thenReturn(existingCtx);

      const context = {
        options: "mydb"
      } as InterceptorContext;
      const next = (() => {
        // noop
      }) as InterceptorNext;
      when(mikroOrmRegistryMock.get("mydb")).thenReturn(instance(mikroOrm));
      when(entityManagerMock.name).thenReturn("mydb");

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(mikroOrmRegistryMock.get("mydb")).once();
      verify(entityManagerMock.fork(anything(), anything())).once();
      verify(entityManagerMock.flush()).once();
    });
  });
});
