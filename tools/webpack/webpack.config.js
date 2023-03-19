exports.create = ({root, name, externals = {}, resolve = {}}) => {
  return {
    mode: "production",
    devtool: "source-map",
    stats: {warnings: false},
    target: "web",
    entry: {
      main: "./src/index.ts"
    },
    output: {
      path: `${root}/lib/browser/`,
      filename: `${name}.umd.min.js`,
      library: name,
      libraryTarget: "umd"
    },
    resolve: {
      ...resolve,
      extensions: [".tsx", ".ts", ".js"]
    },
    externals,
    module: {
      rules: [
        {
          test: /\.ts?$/,
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
