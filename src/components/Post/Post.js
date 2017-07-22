import { h } from "preact";

import posts from "../lib/posts";

const Post = () => <div dangerouslySetInnerHTML={{ __html: posts[0].html }} />;

export default Post;
