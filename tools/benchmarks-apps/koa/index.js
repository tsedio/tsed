const Koa = require("koa");
const Router = require("@koa/router");
const {printMemory} = require("../printMemory");
const app = new Koa();
const router = new Router();

router.get("/", async (ctx) => {
  printMemory("koa");
  ctx.body = "Hello world!";
});

router.get("/rest/path", async (ctx) => {
  printMemory("koa");
  ctx.body = "Hello world 2!";
});

app
  .use(async (ctx, next) => {
    await next();
    const status = ctx.status || 404;

    if (status === 404) {
      ctx.body = "NOT FOUND ?";
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(process.env.PORT || 3000);
printMemory("koa");
