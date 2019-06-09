
/**
 *
 * @param stream
 * @returns {Promise<any>}
 */
exports.toPromise = stream =>
  new Promise((resolve, reject) =>
    stream
      .on("end", resolve)
      .on("finish", resolve)
      .on("error", reject)
  );
