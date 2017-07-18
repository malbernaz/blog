import { h, render } from "preact";

import App from "./App";

const mnt = document.getElementById("mnt");

const context = {
  insertCss(...s) {
    const removeCss = s.map(x => x._insertCss());

    return () => removeCss.forEach(f => f());
  }
};

render(<App context={context} />, mnt, mnt.lastElementChild);
