const express = require("express");
const {printMemory} = require("../printMemory");
const app = express();

app.get("/", async (req, res) => {
  printMemory("express");
  res.send("Hello world!");
});
app.listen(process.env.PORT || 3002);
printMemory("express");
