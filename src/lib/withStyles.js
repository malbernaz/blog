import { h, Component } from "preact";

export default function withStyles(...styles) {
  return WrappedComponent =>
    class WithStyles extends Component {
      componentWillMount() {
        if (process.env.NODE_ENV !== "test")
          this.removeCss = this.context.insertCss.apply(undefined, styles);
      }
      componentWillUnmount() {
        if (process.env.NODE_ENV !== "test") setTimeout(this.removeCss, 0);
      }
      render(props) {
        return <WrappedComponent {...props} />;
      }
    };
}
