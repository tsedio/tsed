module.exports = {
  mode: "development",
  devtool: "source-map",
  stats: {warnings: false},
  entry: {
    main: "./src/index.ts"
  },
  output: {
    path: __dirname + "/lib/browser/"
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
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
  plugins: [],
  optimization: {
    minimize: true,
    concatenateModules: true
  }
};
