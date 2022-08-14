import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

// webpack configs
import * as WebpackRules from "./webpack/rules";
import * as WebpackResolves from "./webpack/resolves";
import * as WebpackModuleFederation from "./webpack/moduleFederation";

export default (): Configuration => {
  const config: Configuration = {
    target: "web",
    devtool: "source-map",
    mode: "development",
    entry: {
      index: path.resolve("./src/client/index.ts"),
    },
    output: {
      uniqueName: "render", // in package
      publicPath: "auto",
      path: path.resolve("./dist/client"),
    },
    plugins: [
      new CleanWebpackPlugin(),
      WebpackModuleFederation.client,
      // new ForkTsCheckerWebpackPlugin({
      //   async: true,
      // }),
    ],
    resolve: WebpackResolves.common,
    module: {
      rules: [...WebpackRules.common],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `/vendor/npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  };

  return config;
};
