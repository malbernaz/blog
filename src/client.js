import { h, render } from "preact";

import App from "./App";

const mnt = document.getElementById("mnt");

render(<App />, mnt, mnt.lastElementChild);
