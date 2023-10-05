import {TestWorkflowEnvironment} from "@temporalio/testing";

module.exports = async function () {
  const envTest = await TestWorkflowEnvironment.createTimeSkipping();
  await envTest.teardown();
};
