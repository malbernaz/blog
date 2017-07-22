import { h, render } from "preact";

import App from "./App";

const mnt = document.getElementById("mnt");

const context = {
  insertCss(...s) {
    const removeCss = s.map(x => x._insertCss());

    return () => removeCss.forEach(f => f());
  }
};

function bootstrap(App) {
  render(<App context={context} />, mnt, mnt.lastElementChild);
}

bootstrap(App);

if (module.hot) {
  module.hot.accept(["./App"], () => {
    const NextApp = require("./App").default;
    bootstrap(NextApp);
  });
}
