/**
 * Check if the code is running in a Google Cloud Functions environment.
 * @returns True if running in GCP, false otherwise
 */
export function isInGCP(): boolean {
  return (
    // Check for GCP environment variables
    process.env.FUNCTION_NAME !== undefined ||
    process.env.FUNCTION_TARGET !== undefined ||
    process.env.FUNCTION_SIGNATURE_TYPE !== undefined ||
    process.env.K_SERVICE !== undefined ||
    process.env.GOOGLE_CLOUD_PROJECT !== undefined
  );
}
