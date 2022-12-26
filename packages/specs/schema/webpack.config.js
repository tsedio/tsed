module.exports = {
  mode: "production",
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
  optimization: {}
};
