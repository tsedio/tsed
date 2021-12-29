import {DBContext, MikroOrmRegistry, RetryStrategy} from "../services";
import {TransactionalInterceptor} from "./TransactionalInterceptor";
import {anything, instance, mock, reset, spy, verify, when} from "ts-mockito";
import {InterceptorContext, InterceptorNext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {EntityManager, MikroORM, OptimisticLockError} from "@mikro-orm/core";

describe("TransactionalInterceptor", () => {
  const mikroOrmRegistryMock = mock<MikroOrmRegistry>();
  const mikroOrm = mock(MikroORM);
  const entityManagerMock = mock(EntityManager);
  const loggerMock = mock<Logger>();
  const retryStrategyMock = mock<RetryStrategy>();
  const dbContext = new DBContext();
  const next = (() => {
    // noop
  }) as InterceptorNext;

  afterEach(() =>
    reset<MikroOrmRegistry | MikroORM | EntityManager | Logger | RetryStrategy | DBContext>(
      mikroOrmRegistryMock,
      mikroOrm,
      entityManagerMock,
      loggerMock,
      retryStrategyMock
    )
  );
  beforeEach(() => {
    when(mikroOrm.em).thenReturn(instance(entityManagerMock));
    when(entityManagerMock.fork(anything(), anything())).thenReturn(instance(entityManagerMock));
  });

  describe("intercept", () => {
    it("should run within a new context", async () => {
      // arrange
      const transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext, instance(loggerMock));
      const context = {} as InterceptorContext;

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
      const transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext, instance(loggerMock));
      const context = {} as InterceptorContext;

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

    it("should apply a retry mechanism if retry is enabled", async () => {
      // arrange
      const transactionalInterceptor = new TransactionalInterceptor(
        instance(mikroOrmRegistryMock),
        dbContext,
        instance(loggerMock),
        instance(retryStrategyMock)
      );
      const context = {options: {retry: true}} as InterceptorContext;

      const spiedDbContext = spy(dbContext);

      when(retryStrategyMock.acquire(anything())).thenResolve();
      when(mikroOrmRegistryMock.get(anything())).thenReturn(instance(mikroOrm));
      when(entityManagerMock.name).thenReturn("default");
      when(entityManagerMock.flush()).thenReject(OptimisticLockError.lockFailed("Lock"));

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(retryStrategyMock.acquire(anything())).calledAfter(spiedDbContext.run(anything(), anything()));
    });

    it("should log a warning if the retry is enabled, while a retry strategy is not resolved", async () => {
      // arrange
      const transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext, instance(loggerMock));
      const context = {options: {retry: true}} as InterceptorContext;

      when(mikroOrmRegistryMock.get(anything())).thenReturn(instance(mikroOrm));
      when(entityManagerMock.name).thenReturn("default");

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(loggerMock.warn(`To retry a transaction you have to implement a "${RetryStrategy.description}" interface`)).once();
    });

    it("should run under existing context", async () => {
      // arrange
      const transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext, instance(loggerMock));
      const existingCtx = new Map([["default", instance(entityManagerMock)]]);
      const context = {} as InterceptorContext;

      const spiedDbContext = spy(dbContext);

      when(spiedDbContext.getContext()).thenReturn(existingCtx);

      // act
      await transactionalInterceptor.intercept(context, next);

      // assert
      verify(mikroOrmRegistryMock.get(anything())).never();
      verify(entityManagerMock.fork(anything(), anything())).never();
      verify(entityManagerMock.flush()).never();
    });

    it("should run under existing context using different connection", async () => {
      // arrange
      const transactionalInterceptor = new TransactionalInterceptor(instance(mikroOrmRegistryMock), dbContext, instance(loggerMock));
      const existingCtx = new Map([["default", instance(entityManagerMock)]]);
      const context = {
        options: "mydb"
      } as InterceptorContext;

      const spiedDbContext = spy(dbContext);

      when(spiedDbContext.getContext()).thenReturn(existingCtx);
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
