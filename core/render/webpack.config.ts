import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default (): Configuration => {
  const config: Configuration = {
    target: "web",
    devtool: "source-map",
    mode: "development", // process.env.NODE_ENV === 'development' ? "development" : "production",
    entry: {
      index: path.resolve("./src/index.tsx"),
    },
    output: {
      publicPath: "auto",
      path: path.resolve("./dist/client"),
    },
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      ],
    },
  };

  return config;
};
