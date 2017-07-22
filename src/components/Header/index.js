import { h } from "preact";

import withStyles from "../../lib/withStyles";

import s from "./Header.css";

const Header = () =>
  <header class={s.root}>
    <h1>malbernaz.me</h1>
  </header>;

export default withStyles(s)(Header);
