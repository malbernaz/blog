import { h } from "preact";

import withStyles from "../../lib/withStyles";

import s from "./PostsList.css";

import posts from "../../lib/posts";

const PostsList = () =>
  <div class={s.root}>
    {posts.map(p =>
      <div class={s.post} key={`post: ${p.meta.title}`}>
        <h2>
          {p.meta.title}
        </h2>
        <span>
          {p.meta.created}
        </span>
      </div>
    )}
  </div>;

export default withStyles(s)(PostsList);
