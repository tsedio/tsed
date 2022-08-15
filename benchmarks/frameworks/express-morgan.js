import express from "express";
import morgan from "morgan";

const app = express();

app.disable("etag");
app.disable("x-powered-by");
app.use(morgan("tiny"));
app.get("/", function (req, res) {
  res.json({hello: "world"});
});

app.listen(3000);
