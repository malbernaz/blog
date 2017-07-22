---
title: MY JOURNEY ON BUILDING THIS BLOG
created: 2017-07-22T23:23:50.226Z
---
MY JOURNEY ON BUILDING THIS BLOG

What could I write for my blog's first post? Writing is very unfamiliar to me, nevertheless that's the main goal I'm trying to accomplish here. So I've chose to write this post covering my development process. I'll try to do that by sharing some views on how the web is evolving, the development process as a whole and exposing a superficial view on the stack I've adopted.

A JAVASCRIPT PATH TO ENLIGHTENMENT

It's hard for us web devs to keep the pace these days. Our workflow has to evolve every time the tendencies of our environment changes. In the other hand as tech comes and goes, we still need to keep sane in the choices we make in order to make our selfs productive. So we live in a paradox: using every brand new and shiny thing the community get's excited about can lead us into a trap, but in the same way we cannot neglect those changes, because the web is in fact evolving.

A good procedure in this case is to extract from all those novelties what's really worth the price to learn and identify what are the tendencies that can withstand to time. In this process you can eventually find a stack that suits well.

That's sort of what I was looking for while building this application. I've started following along a ton of examples and got inspiration from ones of many boilerplates, until a point I've arrived in a setup I could consider mine, having found a set of tools and technologies I could feel safe to work with and rely on.

MY STACK

REACT

I'm using React both on client and server, in an isomorphic setup. Reasons:

First I've found that it has a great API. If you understand the React component specs and lifecycle, you wont understand it for sure, but you'll be able to build anything you want with it. At the end of the day, if you have a good javascript understanding, you can easily grep your hands in React.

Another feature that makes React appealing to me is it's server friendliness, being relatively straightforward to work with it together with node, for instance. When we start to talk about progressive enhancements, server side rendering is the first step to be taken. By doing that I've got in exchange a really fast first meaningful paint.

But I think that what really drove me into the React world is the level of the discussions being brought around it's ecosystem. As React is not so much a fully fledged front-end framework, and more a like view layer, they tend to orbit a lot more on design patterns that are being used with it, techniques and very interesting theoretical matters.

REDUX

Redux emerged last year, presented in the talk React Live: Hot Reloading with Time Travel (fundamental talk to understand the background in with it was created), by Dan Abramov — the author. Surprisingly, his primary motivation was to simply create a lib to suit his needs: better dev tools and experience.

In that talk Dan gave a pretty amazing demonstration on he was achieving with hot-module-replacement in conjunction with Redux and react-hot-loader, another lib authored by him, showing how he could manage to hot reload components, but still preserve the app's state.

Just throwing some words about the lib — because there is to much to say, Redux has a very functional approach on the way it works, leveraging concepts such as immutability and pure functions. It improves Flux's unidirectional data flow by first removing logic handling from the store (state) and second by getting rid of side-effects (because actions are pure functions).

There's a lot to say about Redux, which's not what I'm looking for right now. But it certainly deserve a post of it's own, that I'll surely write in the near future, covering some interesting topics such as async data flow and middleware. Until there you can just take a look at the official documentation, that's very enlightening.

CSS MODULES

It's classical from a hardcore dev's point of view to underestimate the importance of CSS, but if you work on the front-end you'll soon realize you can't live without it. The best way I've found to deal with it in this project was to use CSS Modules. This choice came to be for two main reasons.

Organization: CSS Modules introduces the concept of scoped CSS, so it comes really handy when, for instance, creating selectors, you don't have to worry about duplicate class names. As a bonus it encourages a flatter structure for your stylesheets, avoiding problems with selectors precedence and specificity issues.

The second reason was React. There are a lot of solutions to work with styles in React – many good ones. CSS Modules appeals to me because it deals with plain styles. The only hack I needed to make it work, was to include a module loader to Webpack, and some little adjustments to my code, but isomorphic-style-loader came to the rescue.

WEBPACK

I have a genuine love for tools, but learning Webpack took me a while and required some mind bending as I was very much used with task runners such as Gulp and Grunt. But what really made the process particularly painful was Webpack's poor documentation and not the module bundler concept by it self. At first the amount of options and loaders available just made me feel lost.

Important to say that this problem is about to be overcomed. Webpack 2 – the version I'm currently using – is getting close to it's final release and a brand new documentation is being written to tackle this very issue.

Amongst some of Webpack 2 new cool features, there's tree shaking – in a very basic level it means that it can understand ES6 modules, letting you import just the bits you need. This results in much smaller bundles.

With HTTP2 becoming more popular each day, our old habits of delivering all of our assets in less bundles with greater size is becoming outdated. So another important feature of Webpack is code splitting:

System.import('./your/module')
  .then(({ Module }) => doSomething(Module))
  .catch(handleErr)
The System.import statement above is treated as a break point. So the module imported is separated into its own bundle.

A practice I'm using in this project that's worth mentioning is that I'm compiling my server. That was the best workaround I've found for doing isomorphism. Kind of hard to setup first, but it was worth the effort as I could get the benefits of writing javascript in it's newer syntax – particularly the new modules system.

SUMMING UP

There are some other nice stuff I'm using in the app. Service workers, and Docker on my infrastructure, etc... But I feel I've not much to say for now, this first post was kind of experimental.

That's that, if you're still here by now thank you very much and I hope you've enjoyed. I'm planning to release some new material in the near future, as many of the subjects addressed here deserves their own posts. So, stay tuned.
