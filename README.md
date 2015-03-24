# Red October
Made with ♥ by gnb

## Re-verify our range to target... one ping only.
![One Ping Only](https://dl.dropboxusercontent.com/u/33854/onepingonly.gif)

Red October is a tool for measuring page response time on each of the AEM Publishers. In production, it is located at http://redoctober.its.sfu.ca (restricted to the lcp-staff list).

## Getting Started

* clone the repo
* create a `config/local.json` file (see `config/local.json.example`)
* `npm install`
* `npm start`
* visit `http://localhost:7464`

The example config assumes that you have set up SSH tunnels from your machine to the publishers. YMMV.

## Tests

* `npm test` (no tunnels required; tests against public URLs)

## Specs

* [nodejs](http://nodejs.org)
* [react](http://facebook.github.io/react/)
* [webpack](http://webpack.github.io/)
* [less](http://lesscss.org/) (for the SFU CLF)
* [cas](https://github.com/sfu/node-cas-sfu)
* [es6](http://es6rocks.com/) with [babel](https://babeljs.io/)

![Connery](https://dl.dropboxusercontent.com/u/33854/ezgif.com-resize.gif)