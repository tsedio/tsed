const { join, extname } = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

function appendTsExtension(path) {
  return extname(path) === ".ts" ? path : path + ".ts";
}

const webpackDefaultsFactory = (
  sourceRoot,
  relativeSourceRoot,
  entryFilename,
  isDebugEnabled = false,
  tsConfigFile = "tsconfig.compile.json",
  plugins
) => ({
  entry: appendTsExtension(join(sourceRoot, entryFilename)),
  devtool: isDebugEnabled ? "inline-source-map" : false,
  target: "node",
  output: {
    filename: join(relativeSourceRoot, `${entryFilename.replace('.ts', '')}.js`),
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true, // !isAnyPluginRegistered(plugins),
              configFile: tsConfigFile
              // getCustomTransformers: (program) => ({
              //   before: plugins.beforeHooks.map((hook) => hook(program)),
              //   after: plugins.afterHooks.map((hook) => hook(program)),
              //   afterDeclarations: plugins.afterDeclarationsHooks.map((hook) =>
              //     hook(program)
              //   )
              // })
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigFile
      })
    ]
  },
  mode: "none",
  optimization: {
    nodeEnv: false
  },
  node: {
    __filename: false,
    __dirname: false
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
        ];

        if (!lazyImports.includes(resource)) {
          return false;
        }

        try {
          require.resolve(resource, {
            paths: [process.cwd()]
          });
        } catch (err) {
          return true;
        }
        return false;
      }
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: tsConfigFile
      }
    })
  ]
});

// function isAnyPluginRegistered(plugins) {
//   return (
//     (plugins.afterHooks && plugins.afterHooks.length > 0) ||
//     (plugins.beforeHooks && plugins.beforeHooks.length > 0) ||
//     (plugins.afterDeclarationsHooks &&
//       plugins.afterDeclarationsHooks.length > 0)
//   );
// }

const config = webpackDefaultsFactory(
  `${__dirname}/src`,
  "./",
  "index.ts"
)
const lazyImports = [
  "@tsed/platform-exceptions",
  "@tsed/json-mapper",
  "@tsed/platform-params"
]
module.exports = {
  ...config,
  externals: [],
  plugins: [
    ...config.plugins,
    new webpack.IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
        }
        return false;
      },
    }),
  ],
};

