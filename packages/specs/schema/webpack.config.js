const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "source-map",
  stats: {warnings: false},
  entry: {
    main: "./src/index.ts"
  },
  output: {
    path: __dirname + "/lib/browser/",
    filename: "schema.umd.min.js",
    library: "schema",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      path: require.resolve("path-browserify")
    }
  },
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
              configFile: "tsconfig.compile.esm.json"
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Make a global `process` variable that points to the `process` package,
      // because the `util` package expects there to be a global variable named `process`.
      // Thanks to https://stackoverflow.com/a/65018686/14239942
      process: "process/browser"
    })
  ],
  optimization: {}
};
