import {IncomingMessage, ServerResponse} from "http";

/**
 * @ignore
 */
export const createFakeRawDriver = () => {
  // istanbul ignore next
  function router(req: IncomingMessage, res: ServerResponse) {
    console.log("Fake HTTP application");
  }

  // istanbul ignore next
  function use(...args: any) {
    router._layers.push(args);
    return this;
  }

  router._layers = [] as any[];
  router.use = use;
  router.all = use;
  router.get = use;
  router.patch = use;
  router.post = use;
  router.put = use;
  router.head = use;
  router.delete = use;
  router.options = use;

  return router as any;
};
