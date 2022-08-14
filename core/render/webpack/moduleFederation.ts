import webpack from "webpack";

const { ModuleFederationPlugin } = webpack.container;

export const client = new ModuleFederationPlugin({
  name: "master", // build name by package.json
  shared: {
    react: { singleton: true,  requiredVersion: "18.2.0" }, // to external
    "react-dom": { singleton: true, requiredVersion: "18.2.0" }, // to external
    moment: { singleton: true },
  },
});
