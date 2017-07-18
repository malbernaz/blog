const fs = require("fs");
const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");

const serverConfig = require("./webpack/server.config");
const clientConfig = require("./webpack/client.config");

const babelConfig = JSON.parse(fs.readFileSync(".babelrc", "utf-8"));

module.exports = (env = { dev: false, server: false }) => {
  const eslintRule = {
    test: /\.js$/,
    enforce: "pre",
    exclude: /node_modules/,
    loader: "eslint-loader"
  };

  const jsRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: babelConfig
  };

  const cssRule = {
    test: /\.css$/,
    use: [
      "isomorphic-style-loader",
      {
        loader: "css-loader",
        options: {
          minimize: { zIndex: false },
          modules: true,
          localIdentName: env.dev
            ? "[name]__[local]-[hash:base64:5]"
            : "[hash:base64:5]"
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [
            require("autoprefixer")({ browsers: ["last 2 versions"] })
          ]
        }
      }
    ],
    exclude: /node_modules/
  };

  const fileRule = {
    test: /\.(gif|png|jpe?g|svg|woff|woff2)$/,
    use: [
      {
        loader: "url-loader",
        options: { limit: 10000 }
      },
      {
        loader: "image-webpack-loader",
        options: {
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: "65-90",
            speed: 4
          }
        }
      }
    ]
  };

  const base = {
    module: {
      rules: [eslintRule, jsRule, cssRule, fileRule]
    },
    devtool: env.dev ? "eval" : false,
    bail: !env.dev,
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          env.dev ? "development" : "production"
        )
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(env.dev ? [] : [new BabiliPlugin()])
  };

  return env.server ? serverConfig(env, base) : clientConfig(env, base);
};
