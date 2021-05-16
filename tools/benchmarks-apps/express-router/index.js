const express = require("express");
const {printMemory} = require("../printMemory");
const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
  printMemory();
  return res.send("Hello world!");
});

app.use("/", router);
app.listen(process.env.PORT || 3000);
printMemory();
