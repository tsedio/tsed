export function shouldHideMessage(env = process.env) {
  // Show message if it is forced
  if (env.GITHUB_SPONSORS_FORCE) {
    return false;
  }

  // Don't show after oracle postinstall
  if (env.OC_POSTINSTALL_TEST) {
    return true;
  }

  // Don't show if on CI
  if (env.CI || env.CONTINUOUS_INTEGRATION) {
    return true;
  }

  // Only show in dev environment
  return Boolean(env.NODE_ENV) && !["dev", "development"].includes(env.NODE_ENV);
}
