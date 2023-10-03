import * as workflow from "@temporalio/workflow";

const {greet} = workflow.proxyActivities({
  startToCloseTimeout: "1 minute"
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  const result = await greet(name);
  return result;
}
