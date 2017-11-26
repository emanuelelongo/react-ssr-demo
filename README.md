# React Server Side Rendering Demo

> _Je n'ai fait celle-ci plus longue que parce que je n'ai pas eu le loisir de la faire plus courte._ [cit. Blaise Pascal]   
_**I would have written a shorter letter, but I did not have the time.**_   


## Introduction
This is a step-by-step guide to building a React/Redux application capable of renderize pages on the server.
Before to start let's clarify two terms that are often used interchangeably: **Isomorphic** and **Universal**.

The definitions I found useful is the [Gert Hengeveld's](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb) ones (emphasis mine):

 > _Isomorphism_ is the functional aspect of seamlessly switching between client-side and server-side rendering **without losing state**. _Universal_ is a term used to emphasize the fact that a particular piece of JavaScript code is **able to run in multiple environments**.

Another useful distinction, again from the same article, is between **functional isomorphism** and **technical isomorphism**:

> Having the server render the HTML on first page load is the _functional part_, the thing that provides for a **better user experience**. The _technical part_ is where we use the same code in both environments, which no user ever asked for, but **makes a developer’s life easier** (at least in theory).

These definitions should tickle our fancy; there are many different goals (performance, user experience, seo) that we may want to achive or simply ignore because no relevant for our application domain.
For sure, isomorphism isn't something that we can just turn on and forgetting about.

## Step-by-step

This repository has several commits, it starts with a trivial React _hello world_, so that we can get familiar with a minimal webpack configuration, and ends up with a React/Redux application with routing, data fetching and development/production build configurations.

## Step one - Webpack Minimal Configuration

Let's clone the repo and move to the first commit:

``` sh
git clone https://github.com/emanuelelongo/react-ssr-demo.git
cd react-ssr-demo
git checkout c86677d
```

Take a look at the <code>webpack.config.js</code> file. It defines the entry point for the bundle creation:

``` js
entry: './app/index.js',
```

the output location for the bundle once created:
 ``` js
output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
}
```

and the loaders needed to process js files (only babel in this case):
``` js
module: {
    loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
}
```

Another thing you should notice is the [HtmlWebpackPluginConfig plugin](https://github.com/jantimon/html-webpack-plugin) and its configuration:

``` js
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './app/index.html',
    filename: 'index.html',
    inject: 'body'
})
```

We need this because we are using [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to serve our application and essentialy this configuration says to create the main HTML page by starting from a given template and injecting the bundle inside the <code>\<body\></code> element.

We can try this simple example

``` sh
npm install
npm start
```

## Step 2 - Serving with Express
We can now move on the next commit.

``` sh
git checkout e141844
```

Did you like <code>webpack-dev-server</code>? We are going to remove it!

Yes it was a handy tool... but to achive our goal we need to get full control of how our application is served to clients so we are going to use our old dear friend [Express JS](https://expressjs.com/).

#### package.json

The first file you should check is the <code>package.json</code>, we changed the start script to launch a Node process and also added several dependencies that we are going to use in a few moments.

#### Webpack

From the <code>webpack.config.js</code> file we simply removed all the _HtmlWebpackPlugin_ parts. But at the same time we created a <code>dev-middleware.js</code> file that extends the basic webpack configuration by adding two useful middleware: 

* [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) \
  serves the files emitted from webpack without writing to disk. It handle the files in memory.

* [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) \
  add the _hot reloading_ feature to webpack-dev-middleware.

The idea is that these two middleware will not be used in production mode but we will deal with it afterwards.

#### Server

The server logic is inside the <code>server.js</code> file. Briefly it:

* serves the <code>dist</code> folder statically (which will contains the bundle)
* register the dev middlewares discussed above
* reply to all other requests with a simple HTML that include the bundle.js script

#### Index

The <code>index.js</code> file, which is the real entry point on the server, does nothing but register babel so that we can use ES6 feature without transpiling the server code. Remember that Webpack is only transpiling the <code>app</code> folder which becomes the bundle.js and just served to the client.
This is a temporary solution to keep things simple, we are going to improve this aspect on the next steps.

## Step 3 - A bit of Routing
Let's move to the next commit:

``` sh
git checkout fbbf97a
```
Here we are not going to change any configuration but just transforming the application into something more realistic even still very simple.

We now have two pages: an empty _home page_ and a _currency page_ which shows a list of _currency pairs_ fetched through an external service. By clicking on a currency pair some information about the selected exchange are fetched and shown below.

This is enough to give us a bit of routing and data fetching, two aspect that are challenging in an isomorphic application.

Just notice that at the moment if you request directly the path <code>/currencies</code> the server will reply with the home page and then the routing will be handled by the client. At least unitl next step...

## Step 4 - Server Side Routing

``` sh
git checkout b10573b
```

With this step we start approaching a server side rendering and we start from the routing. Essentially we want that when a request reach the server the path is evaluated and the involved components are rendered to html and returned to client.
The client will continue execution by mounting the components but the route will be _in sync_ with the server.

How it can be obtained? Take a look at the <code>/app/index.js</code> file, that is where the client routing are handled:

``` jsx
ReactDOM.render(
  <Router>
    <div>{renderRoutes(routes)}</div>
  </Router>
  , document.getElementById('root'))
```
here we wrapped the whole app inside a <code>\<Router></code> tag. Well, to make routing works on the server we need to do _the same thing_ on the server side but with a special router provided by <code>react-router-dom</code> package: the <code>\<StaticRouter></code>.

You can see it in action in the <code>/src/helpers/renderApp.js</code> file:

``` jsx
const view =
    <Router location={path} context={context}>
        <div>{renderRoutes(routes)}</div>
    </Router>
const appHTML = renderToString(view)
```

Look also, a few lines later, how the HTML produced is then renderized on the server:

``` html
<body>
    <div id="root">${appHTML}</div>
    <script type="text/javascript" src="/bundle.js"></script>
</body>
 ```

This is almost all the trick. If a search engine crowler would scan a route it would see the right content... except for the data that at the moment is fetched from the client.

## Step 5 - Moving to Redux

It should be clear that the next step would be to load the data on the server but with the current architecture, to do such thing can be tricky.
The problem is that we don't have a single place where to store data. Instead each component has its own state and even if you load the data for each component than you have to keep the client's state coherent after rendering.
The Redux architecture makes this process easier since there is a single store.
Let's move to Redux.

``` sh
git checkout 51a43b7
```

The transition is quite simple:

* inside the the <code>app/index.js</code> file we made the standard integration of the Redux provider
* then we moved the http calls from components to the new actions
* lastly the components reads the data from props instead that from theirs internal states


## Step 6 - Fetch Data on the Server

We are now ready for the last step, probably the most interesting: fetching the data on the server.

We can identify four key points to reach the goal:
 * **Point 1**:  the components _statically_ declare its required data (or better to say, the actions it needs to be executed)
 * **Point 2**: the server discover the components that will be rendered by processing the requested route
 * **Point 3**: the server fetch the data required by each component discovered
 * **Point 4**: once the data is available the Redux state is prepared, injected into a WINDOW variable and sent to the client

Let's see each point in the details by moving to the next commit:

``` sh
git checkout 2fb1a1e
```

#### Point 1
Let's open the <code>app/pages/Currencies.js</code> file where the _Currencies_ components is defined. It declares a static array property:

``` js 
Currencies.requirements = [fetchCurrencies]
```

This array define all the actions that has to be perfomed to make data available into the state, in this case the action is only one: _fetchCurrencies_.
You may wondering if the action itself needs some sort of adaptation to work both on server and client: the answer is yes, we need to install and import the <code>isomorphic-fetch</code> package, as you can see opening the <code>app/actions/fetchCurrencies.js</code> file:

``` js
import fetch from 'isomorphic-fetch'
```

#### Point 2
The second point may seems the most intricate but luckily it is all done by the <code>matchRoutes</code> method exposed by the <code>react-router-config</code> package as you can see opening the <code>helpers/matchRouteComponents.js</code> file:

``` jsx
import { matchRoutes } from 'react-router-config'; 

export default function(path, routes) {
    return matchRoutes(routes, path)
    .map(({ route }) => route.component)
 } 
```
Just notice that this method takes the <code>routes</code> object as input, in fact it needs to know all the routes to determine which components will be rendered.

#### Point 3
Well, now we have a list of components; each component exposes an array of required actions; the third point is about collecting data by executing all these actions and is implemented in the <code>helpers/fetchComponentData.js</code> file:

``` jsx
export default function fetchComponentData(dispatch, components) {
    const requirements = components.reduce( (prev, current) => {
        return current ? (current.requirements || []).concat(prev) : prev;
    }, []);
   const promises = requirements.map(requirement => dispatch(requirement()));
   return Promise.all(promises);
}
```
Ok, this can look a bit tricky but it is just joining all the promises and wait for all to complete.

#### Point 4

This is the final point, where all the things are assembled. Let's look at the <code>server.js</code> file, where we make use of the two helpers created above.

Also look at the <code>helpers/renderApp.js</code> and <code>app/index.js</code>files to see how the <code>INITIAL_STATE</code> is injected into the html and loaded from the client.

## Bonus step - Build for Production

Cool, we finished!

With this very last step we just change a bit the code structure and add the npm commands required to build the production package.

 ``` sh
git checkout 4a55af3
```
Looking at <code>package.config</code> we now have these commands:

 * <code>npm run dev</code> run in _dev mode_
 * <code>npm run build</code> builds a static <code>bundle.js</code> file
 * <code>npm start</code> run the application in _production mode_
 * <code>npm run clean</code> to clear the building and installation folders

## Further Steps

* chunck
* connected router
* style