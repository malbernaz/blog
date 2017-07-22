import s from "./App.css";

import { h, Component } from "preact";
import Provider from "./lib/Provider";
import withStyles from "./lib/withStyles";
import Header from "./components/Header";
import PostsList from "./components/PostsList";

@withStyles(s)
class Root extends Component {
  render() {
    return (
      <div class={s.root}>
        <Header />
        <PostsList />
      </div>
    );
  }
}

const App = ({ context }) =>
  <Provider context={context}>
    <Root />
  </Provider>;

export default App;
