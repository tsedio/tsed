module.exports = async () => {
  await global.__MONGOD__.stop();
};
