const path = require("path");
const fs = require("fs");

module.exports = (env, base) =>
  Object.assign({}, base, {
    entry: path.resolve("src", "server.js"),
    output: {
      filename: "index.js",
      path: path.resolve("dist")
    },
    module: {
      rules: base.module.rules.concat([
        {
          test: /\.html$/,
          exclude: /node_modules/,
          loader: "svelte-loader",
          options: {
            generate: "ssr",
            css: false
          }
        }
      ])
    },
    target: "node",
    node: {
      __dirname: false,
      __filename: false
    },
    externals: fs
      .readdirSync("node_modules")
      .filter(x => [".bin"].indexOf(x) === -1)
      .reduce((ext, mod) => Object.assign(ext, { [mod]: `commonjs ${mod}` }), {
        "./assets.json": "commonjs ./assets.json"
      }),
    plugins: base.plugins
  });
