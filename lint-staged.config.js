module.exports = {
  "**/*.{ts,js}": ["eslint --fix"],
  "**/*.{ts,js,json,md,yml,yaml}": ["prettier --write"]
};
