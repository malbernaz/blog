import { Component } from "preact";

export default class Provider extends Component {
  getChildContext() {
    return this.props.context;
  }

  render({ children }) {
    return children[0];
  }
}
