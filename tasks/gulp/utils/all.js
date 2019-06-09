exports.all = (...args) => {
  return Promise.all(
    args.map((stream) =>
      new Promise((resolve, reject) =>
        stream.on('error', reject).on('end', resolve)
      )
    )
  );
};
