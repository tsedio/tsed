module.exports = async () => {
  await global.__MONGOD__ && global.__MONGOD__.stop();
};
