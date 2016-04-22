# universal-react
To rebase this branch run `git rebase -i "6ebd7a5f8779d997bb221c4e12ace33f58292455"`

## How we got here
### 1. Initial configurations
Not much happening here, but we want to start with some decent defaults

 - .vscode/settings.json - I'm using VSCode so adding some configs now
 - `.eslintrc` - Airbnb has a great ESLint config, it adds React rules but we are using react soon so lets do it. Also no semi-colons..
 - `.editorconfig` - So anyone opening the project uses the right type of spacing
 - `.gitattributes` - Tell git how to handle line endings on the project
 - `package.json` - Yep..

### 2. WebPack
WebPack is a module loader which is super extensible and can replace many of the existing build systems out there.

#### App Structure
Everything will be under `/app`, it is added as a source root which also allows us to `require('services/api.js')` for instance if we have a file under `app/servces/api.js`.

#### NPM Scripts
We are using NPM scripts to coordinate our build. `npm start` will run the site in development mode and `npm run` will list all the available commands. Currently there is `start`, `build:dev` and `build:prod`. 

#### Configuration
Under the `/scripts` folder we have 3 config files, `webpack.config.base.js`, `webpack.config.dev.js` and `webpack.config.prod.js`. Base is common config then dev is for local development and it setup for hot-reload and quick build times. Prod includes cache busting for assets and minification of the bundle.

Notice in production `config.output.filename = 'bundle.[chunkhash].js'`, this means our bundle will be cache busted because the hash of the bundle file will be included in it's filename

#### Plugins
Initially we have

 - `OccurenceOrderPlugin` - makes more reused chunks have a shorter id
 - `CleanWebpackPlugin` - ensures the \dist folder has been cleaned before starting the build/dev server
 - `NoErrorsPlugin` - prevents reload when errors are present
 - `DefinePlugin` - We set the `__DEV__` and `process.env.NODE_ENV` variables so we can conditially require different code for dev and prod
 - `UglifyJsPlugin` - In production this plugin minifies our code
 - `HotModuleReplacementPlugin` - This plugin gives us hot-reload support, see next section
 
Read more about the plugins at [https://webpack.github.io/docs/list-of-plugins.html](https://webpack.github.io/docs/list-of-plugins.html)

#### Server
We have two files to host our application, `server.js` and `hot-server.js`. While optional at this stage it means that our server component
doesn't know about hot-reload and will make universal rendering with hot-reload easier in the end.

The way it works is if server.js has the `hot` environmental variable set, it will use `HOT_PORT` to serve the JavaScript bundle instead of expecting statically built files to exist locally to server.js.

#### Hot module replacement
We are using [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) for hot reloading rather than the webpack-dev-server. It gives us more flexibility and we own the express server which is hosting our site. This is handy for universal rendering down the track.

To make this work we have to hook in the middleware and for the moment hot reloading JavaScript will fail because our code will only run onload. Hot reloading is pointless in this scenario. So we have added an entry point with `'webpack-hot-middleware/client?reload=true'` which says to reload when hot reload fails to update a module.

#### Debugging
To add support for debugging from VSCode we need to help VSCode/Chrome know where the source files are on disk. Webpack will serve the original files from `webpack://` which is no good for debugging.

We add:

```
config.output.devtoolModuleFilenameTemplate = function(info) {
  if (info.absoluteResourcePath.charAt(0) === '/') {
    return "file://" + info.absoluteResourcePath;
  } else {
    return "file:///" + info.absoluteResourcePath;
  }
}
config.output.devtoolFallbackModuleFilenameTemplate = function(info) {
  if (info.absoluteResourcePath.charAt(0) === '/') {
    return "file://" + info.absoluteResourcePath + '?' + info.hash
  } else {
    return "file:///" + info.absoluteResourcePath + '?' + info.hash
  }
}
```

To our dev webpack config to rewrite the module names to files on disk rather than serving through webpack. This gives us F5 debug support in VS Code

Also maybe useful? https://blog.jetbrains.com/webstorm/2015/09/debugging-webpack-applications-in-webstorm/


### 3. ES2015+ support
Next is adding in Babel 6 for transpilation. This enables us to use ES2015 and plug in more babel transforms later.

### 4. React
Now time to actually start building something. 

#### Hot reloading
One of the advantages of WebPack is the in built support for hot-reloading, unfortunately hot-reloading still has compromises. There are 3 main options:

1. React hot loader  
The first hot reloading attempt, it is tied to webpack and works by wrapping the exported component with a proxy then when your component changes it accepts the new version and the proxy points at the new version of your components code. Limitations/notes:
   - Components do not get unmounted/remounted and keep their local state
   - All DOM state is preserved (focus, scroll position etc)
   - Only works for default exported components
   - Does not work well with decorated components
   - Does not work with stateless components
2. React hot transform  
The second attempt moves the logic from WebPack into Babel, this is because as a Babel plugin it is easier to detect what is a React and make the required changes to the source in place. Limitations/notes:
   - Components do not get unmounted/remounted and keep their local state
   - All DOM state is preserved (focus, scroll position etc)
   - Works with multiple components in a single file
   - Works with wrapped/decorated components
   - Does not work with stateless components
3. Re-render app  
This is the simplest approach and just uses native WebPack hot reloading. When anything changes, simply re-render your root component. Notes/limitations:
   - Components are unmounted/remounted
   - DOM state is *not* preserved
   - Local component state lost
   - Works with stateless components
   - Has far less edge cases due to it's simplicity

We are going to go for #3, this is because we are going to use Redux. This means our application state is actually held outside of our React application, this means we can reload the entire application but keep the state.
This blog post by Dan is a good summary of the state of the hot-reload ecosystem.

https://medium.com/@dan_abramov/hot-reloading-in-react-1140438583bf

We also have installed `redbox-react` which we use to display any error messages if rendering fails.

#### Structure
The client will start with `index.js` which renders the application, the pages of our site will live under `pages` each with an `index.js` which is the entry point for that page.

`app.js` is our apps root component, it initialises routing and other things. It is re-rendered by hot-reload when anything under it changes.


#### Other stuff
We installed a module called `html-webpack-template`, this gives us a more flexible and powerfull template for `HtmlWebpackPlugin` to work with. One of the options gives us a mount point for our React application. `react-router` also has been installed which gives us client side routing. 

### 5. All about dem styles
Next up is styles, I am going to go for sass with css-modules support. We will also put autoprefixer in to add in vendor specific browser prefixes automatically.

#### CSS Modules
Allow us to `require('./app-container.module.scss')` which will return a javascript object with keys for all of the classes defined in that css file.

#### Loader config
Styles config is defined in dev and prod configs individually, this is because in prod we extract all styles to a separate .css file.

Then in each environment config we specify two loaders, one for .module.scss (css modules) and one for normal scss files (if .module is not in the filename).

### 6. Redux
Redux allows us to keep our application state in a single atom which is a little strange at first but then becomes a pleasure to work with down the track. Naturally when using React you will move towards one or two top level components containing all your application state anyway so once you have made it to there Redux is the next step.

There are a few things which this step does:

1. Creates a application reducer which can contain anything which is application level.
2. Hook in the [Redux chrome devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
3. Integrate react-router and redux with `react-router-redux`
4. Extend our hot-reloading to reload our reducers as they change
5. Add the `redux-thunk` middleware which allows us to create action creators which can dispatch multiple events. This is handy for things like API calls where you initiate them, then they either succeed or fail

### 7. Simple Server Side Rendering
Most 'universal' samples solve all the problems. The main complications for webpack applications is that we require styles. Node.js cannot do this, so we need other ways to handle styles on the server side. The other one is pre-loading data on the server to load into the initial render.

For the moment we are going to ignore styles and loading data but keep the server side rendering really simple so we can understand the concepts.

The best place to look is the changes to `server/server.js`, which add in:

1. Build the redux store on the server
2. Load the client side routes on the server
3. Resolve the react-router props/component for the current express request route
4. Render the current application route as a string
5. Add the rendered string into our containing div
