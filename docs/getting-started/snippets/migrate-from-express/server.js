const express = require("express");
const bodyParser = require("body-parser");
const compress = require("compression");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const {router: productRouter} = require("./routes/products");

const app = express();
const restRouter = express.Router({mergeParams: true});

// middlewares

app
  .use(cookieParser())
  .use(compress({}))
  .use(methodOverride())
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  );

// routes
restRouter.use("/products", productRouter);

app.use("/rest", restRouter);

exports.expressApp = app;
