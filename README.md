# WebPack-React-Starter
Understanding starter repos is sometimes hard, this repo will show you how we got there. Commit by commit

## How this repo works
The master branch you can treat as normal, it will contain instructions and general info about the repo. 

The other branches are different starting points, some may be Universal, others have Redux. **These branches will be rebased/rewritten when being updated to ensure the best history possible**. This means you should always reset those branches, read [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute updates.

## How to use this repo
1. Clone this repo
2. Pick a branch as a starting point
3. Checkout `master`
4. Run `git reset --hard origin/<branch-name>` - this will reset master to have the history of the chosen branch
5. If there is anything you don't like, revert that commit out (you may have to resolve small merge conflicts)
6. Run `git remote -d origin`
7. You now have a fresh repo with clean history of how each dependency got into your project at this point.
8. You can point your team at this repo to learn about the way your project is configured
9. From this point change anything you want, hopefully the clean history makes it easier

## Branches
### webpack-react-redux
This branch is a starter for a React/Redux project using WebPack, there are a number of additional modules included. 

[View webpack-react-redux branch](https://github.com/JakeGinnivan/WebPack-React-Starter/blob/webpack-react-redux/README.md)

### universal-react
This branch is much like the webpack-react-redux branch, except it also has support for universal rendering (initial render on the server). 

[View universal-react branch](https://github.com/JakeGinnivan/WebPack-React-Starter/blob/universal-react/README.md)
