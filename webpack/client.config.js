const path = require("path");
const webpack = require("webpack");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

module.exports = (env, base) =>
  Object.assign({}, base, {
    entry: path.resolve("src", "client.js"),
    output: {
      filename: env.dev ? "[name].js" : "[name].[hash].js",
      chunkFilename: env.dev ? "[name].js" : "[name].[hash].js",
      path: path.resolve("dist", "public"),
      publicPath: "/"
    },
    module: {
      rules: base.module.rules.concat([
        {
          test: /\.html$/,
          exclude: /node_modules/,
          loader: "svelte-loader"
        }
      ])
    },
    devServer: {
      port: 3030,
      host: "0.0.0.0",
      publicPath: "/",
      clientLogLevel: "error",
      hotOnly: true,
      inline: true,
      proxy: { "*": { target: "http://0.0.0.0:3000" } }
    },
    plugins: base.plugins.concat(
      [new StatsWriterPlugin({ filename: "../assets.json" })].concat(
        env.dev ? [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()] : []
      )
    )
  });
