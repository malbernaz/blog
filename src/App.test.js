import { h, render } from "preact";

import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    render(<App />, div);
  });
});
