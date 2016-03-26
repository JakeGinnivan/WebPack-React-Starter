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
