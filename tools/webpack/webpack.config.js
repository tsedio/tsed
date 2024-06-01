exports.create = ({root, name, entry, externals = {}, resolve = {}}) => {
  return {
    mode: "production",
    devtool: "source-map",
    stats: {warnings: false},
    target: "web",
    entry: {
      main: "./src/index.ts",
      ...entry
    },
    output: {
      path: `${root}/lib/browser/`,
      filename: `${name}.umd.min.js`,
      library: `@tsed/${name}`,
      libraryTarget: "umd"
    },
    resolve: {
      ...resolve,
      extensions: [".tsx", ".ts", ".js"],
      extensionAlias: {
        ".js": [".ts", ".js"]
      }
    },
    externals: {
      "@tsed/core": "@tsed/core",
      "@tsed/schema": "@tsed/schema",
      "@tsed/di": "@tsed/di",
      "@tsed/json-mapper": "@tsed/json-mapper",
      "@tsed/event-emitter": "@tsed/event-emitter",
      ...externals
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)?$/,
          use: [
            {
              loader: "webpack-remove-code-blocks",
              options: {
                blocks: [
                  "debug",
                  "devblock",
                  {
                    start: "node_env:start",
                    end: "node_env:end",
                    prefix: "/*",
                    suffix: "*/"
                  }
                ]
              }
            },
            {
              loader: "ts-loader",
              options: {
                configFile: "tsconfig.esm.json"
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    plugins: [],
    optimization: {}
  };
};
