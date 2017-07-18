import { h, Component } from "preact";
import Provider from "./lib/Provider";
import Header from "./components/Header";

export default class App extends Component {
  render({ context }) {
    return (
      <Provider context={context}>
        <div>
          <Header />
        </div>
      </Provider>
    );
  }
}
