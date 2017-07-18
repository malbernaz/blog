/* eslint-disable no-console */

import path from "path";
import http from "http";
import express from "express";
import render from "preact-render-to-string";
import { h } from "preact";

// eslint-disable-next-line import/no-unresolved
import { assetsByChunkName as assets } from "./assets.json";

import Html from "./components/Html";
import App from "./App";

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, "public")));

app.get("*", (req, res) => {
  const css = [];
  const context = {
    insertCss(...s) {
      s.forEach(style => css.push(style._getCss()));
    }
  };

  const component = render(<App context={context} />);
  const html = render(
    <Html css={css.join("")} component={component} assets={assets} />
  );

  res.end(`<!DOCTYPE html>${html}`);
});

server.listen(
  3000,
  err => (err ? console.error(err) : console.log("\napp running on 3000\n"))
);
