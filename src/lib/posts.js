const requirePosts = require.context("../../posts", true, /\.md$/);

const posts = requirePosts.keys().map(requirePosts);

export default posts;
