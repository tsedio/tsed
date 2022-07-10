import express from "express";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

const router = express.Router();

router.get("/hello", function (req, res) {
  res.json({hello: "world"});
});

app.use("/greet", router);
app.listen(3000);
