---
title: REACT SSR ISN'T THAT HARD. WEBPACK IS...
created: 2017-07-22T22:23:45.675Z
---

*From previous experiences I've came to discover that what's really hard in setting a react server-side rendered application is to set your webpack config. Maybe this post will end up looking more like a tutorial, but what's really important to get here are the concepts.*

As the title says I really don't think that the universal/isomorphic architecture — in react web applications — is that hard to understand. In a nutshell you are just consuming your components from two different entry points (client and server). There are some gotchas... For instance, the only lifecycle event called in the server render is componentWillMount, so you should beware of that if you're looking for a place to use a browser API or the DOM — if you're using ES6 classes the constructor method isn't the best place either.

OK, you've already played with react, you understand front-end stuff and can even do some back-end with node, so you're able to build an app with this sorts of specs with your eyes closed, right? Enters Webpack — "Man, the web was so simple a while ago...". That's right we're in 2017 and I can't stress enough how important is to understand the build tool of you're choice primer to start coding. So let's talk about webpack.

Webpack is a very powerful build tool and it has some really awesome features, but as uncle Ben would say:

With great power comes great responsibilities.
What do I mean with responsibilities? With webpack you are responsible to make every piece of your configuration to match the code in your source, so if something's not working right it's probably your fault. In addition to that webpack stands more like a wrapper for a set of plugins and loaders that transforms your source into an optimized version, so you have to really understand those as well.

Enough of concept, let's write some code. There are two ways to get SSR set with webpack. One is to use this package called webpack-isomorphic-tools and a pure webpack solution, using multiple configuration files — mainly, one for the server and other for the client. The latest option is the one we'll try to dissect here and we'll be dividing it into three parts:

- webpack.config.babel.js - shared
- webpack.server.config.js - server
- webpack.client.config.js - client

Let's start from what those two configs have in common. Beware that I'll be using preact and webpack at version two in my examples.

## SHARED CONFIG

```js
import path from 'path'

export default (env) => ({
  context: path.resolve(__dirname, 'src'),
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        presets: [['es2015', { loose: true, modules: false }]],
        plugins: ['transform-react-jsx', { pragma: 'h' }]
      }]
    }]
  }
})
```

If you're coming from webpack at version one there are some things to notice: the module syntax is completely new, we are not exporting a plain object anymore — we're exporting a function that takes a parameter env that represents the new --env cli's flag and if you take a careful look you'll see that our babel ES2015 preset configuration has two options: loose set to true, for simpler code output, but most importantly we are setting modules to false. What that means is that we're are removing babel's responsibility to deal with modules. By doing so we're delegating it to webpack, as one of it's new features is to understand the new modules syntax and use it to do tree-shacking (another topic).

The config above is almost useless by now, we're just telling webpack what to do with .js files and setting the context to a src folder. Let's briefly sketch our entry points to have an idea of what will be going on later.

## CLIENT.JS

```js
import { h, render } from 'preact'

import Root from './Root'

const mnt = document.querySelector('main')

render(<Root/>, mnt, mnt.lastChild)
```

## SERVER.JS

```js
import path from 'path'
import { h } from 'preact'
import render from 'preact-render-to-string'
import express from 'express'

import Root from 'Root'

const app = express()

app.use(express.static(path.resolve(__dirname, 'public')))

app.get('*', (req, res) => {
  const component = render(<Root/>)

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>some title</title>
    </head>
    <body>
      <main>${ component }</main>
      <script src="main.js"></script>
    </body>
    </html>
  `)
})

app.listen(3000, err => {
  if (err) {
    console.error(err)
  }

  console.log('server running on port 3000')
})
```

As said, in the beginning of this post, we are just consuming a common component from two different entry points. It's worth to explain what's going on on the server entry though. We're are defining an endpoint for all GET requests, rendering our Root component as a string and sending it down as response. In addition to that we are setting a public directory in which we'll put our assets later on. Simple enough? In a real world example we'd be probably using a third-party router in our main endpoint to define what component to render. We can now do some configuration.

## SERVER CONFIG

```js
import path from 'path'
import fs from 'fs'

export default (env, base) => ({
  ...base,
  entry: 'server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  externals:
    // `readdirSync` returns an array with our modules dirnames
    fs.readdirSync('node_modules')
      // Eliminates the `.bin` directory
      .filter(x => ['.bin'].indexOf(x) === -1)
      // Reduces our array to a key/value pair list
      // with the value being prefixed with "commonjs"
      .reduce((acc, mod) => ({
        ...acc, [mod]: `commonjs ${ mod }`
      }), {})
})
```

Let's try to understand what's going on. First entry is defining where is our entry point (src/server.js, because we've set our context earlier, remember?), then we're telling webpack with output, where to output the code — nothing complicated here.

But then the important part comes in: we're setting target to 'node' for our environment. Then with the node option we're customizing our environment even more and telling webpack that we'll be using the global variable __dirname natively, so that we can find the public directory that we've specified in our server entry earlier.

And finally we're setting our externals with a very nifty snippet of code, telling webpack not to bundle our node modules. That's important because webpack doesn't know what to do with binary dependencies like fs and path. This piece of script produces a key/value pair list with the value being prefixed with "commonjs". That, because the externals default behavior is to assume a browser environment (even with target set to node), so a require is turned into a global variable, which is not what we want.

For the above config to work we have to modify our shared config:

```js
/* ... */
import serverConfig from 'webpack.server.config.js'

export default env => {
  const SERVER = /server/.test(env)

  const baseConfig = { /* ... */ }

  if (SERVER) return serverConfig(env, baseConfig)
}
```

Now if you run webpack --env server in your root directory you should expect success. Hooray!

## CLIENT CONFIG

```js
import path from 'path'
import webpack from 'webpack'

export default (env, base) => ({
  ...base,
  entry: 'client.js',
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'main.js',
    publicpath: '/'
  },
  plugins: [].concat(/debug/.test(env) ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ] : []),
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/public'),
    port: 3001,
    host: '0.0.0.0',
    publicPath: '/',
    clientLogLevel: 'error',
    hot: true,
    inline: true,
    proxy: { '*': { target: 'http://0.0.0.0:3000' } }
  }
})
```

Nothing fancy here, right? That's the usual webpack stuff we're all pretty much used to by now. Some things are worth noting though:

We are configuring webpack-dev-server to proxy all of it's requests to target http://0.0.0.0:3000 that is the address of our express server. We could replace 0.0.0.0 on host and target with locahost, but the former allows us to access the server externally — a docker container for instance.

Another piece of configuration you should beware of is publicpath both on devserver and output. This option specifies the public URL of the output directory when referenced in a browser. If you set this wrong you'll receive a 404 error while trying to load your resources.

Two more things. We're also setting hot module replacement for our dev server. So we need to do some little adjustments to our client entry point:

```js
/* ... */

function boot () {
  render(<Root/>, mnt, mnt.lastChild)
}

boot()

if (module.hot) {
  module.accept('./Root', boot)
}
```

And import the client config in the shared one:

```js
/* ... */
import clientConfig from 'webpack.server.config.js'

export default env => {
  /* ... */

  return clientConfig(env, baseConfig)
}
```

With all that set we should be good to go, but as a bonus I'll share the scripts I usually set in my package.json to automate things up:

```JSON
{
  "scripts": {
    "build:dev:client": "webpack --env debug:client",
    "build:dev:server": "webpack --env debug:server",
    "build:dev": "npm run build:dev:client && npm run build:dev:server",
    "start": "npm run build:dev && concurrently --raw --kill-others 'npm run watch:server' 'npm run nodemon' 'npm run watch:client'",
    "nodemon": "nodemon --watch dist --ignore dist/public/ dist",
    "watch:client": "webpack-dev-server --env debug:client",
    "watch:server": "webpack --env debug:server --watch"
  }
}
```

As additional dev dependencies I'm using nodemon, to reboot the server every time a change is made, and concurrently to run all of these processes at the same time.

## SUMMING UP

React, and preact are very nice frameworks to work with, that embrace a very sane paradigm of components and that's all they care about. Then, you can get to use any lib you want to manage your app state (or none). That's a kind of simplicity I've really came to appreciate.

But webpack in the other hand, requires some documentation digging in order to get your build process right, and that's why is so hard to set things up initially. Not a criticism though, I love webpack and the amount of customization it allows me to get and I really think people should take some time to learn it.

That's that, I hope you enjoyed my writing and if you are interested on the topic as much as I do... Hey, please leave me note! And for reference, be free to check out my github repo preact-isomorphic-example, for some insight on how to integrate css to the build and isomorphic data fetching.

## REFERENCES:

- Backend Apps with Webpack (Part I) - http://jlongster.com/Backend-Apps-with-Webpack--Part-I
- Webpack docs - https://webpack.js.org/configuration/
