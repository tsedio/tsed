const Chai = require("chai");
const ChaiAsPromised = require("chai-as-promised");
const SinonChai = require("./sinon-chai");

Chai.should();
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

process.env.NODE_ENV = "test";

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
