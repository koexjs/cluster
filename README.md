# cluster

[![NPM version](https://img.shields.io/npm/v/@koex/cluster.svg?style=flat)](https://www.npmjs.com/package/@koex/cluster)
[![Coverage Status](https://img.shields.io/coveralls/koexjs/cluster.svg?style=flat)](https://coveralls.io/r/koexjs/cluster)
[![Dependencies](https://img.shields.io/david/koexjs/cluster.svg)](https://github.com/koexjs/cluster)
[![Build Status](https://travis-ci.com/koexjs/cluster.svg?branch=master)](https://travis-ci.com/koexjs/cluster)
![license](https://img.shields.io/github/license/koexjs/cluster.svg)
[![issues](https://img.shields.io/github/issues/koexjs/cluster.svg)](https://github.com/koexjs/cluster/issues)

> cluster for koa extend.

### Install

```
$ npm install @koex/cluster
```

### Usage
* 1 command line
* 2 import { startApp } from 'cluster';

```javascript
// app.js / app.ts
import * as Koa from 'koa';

const app = new Koa();

app.use(ctx => {
  ctx.body = 'hi, koa-cluster';
});

export default app;

// 1 command line
> koex-cluster app.js

// 2 code: server.js
import { startApp } from '@koex/cluster';
import app from './app';

startApp(app.callback(), {
  port: 8000,
  host: '0.0.0.0',
});
```

### Related
* [koa-cluster](https://github.com/koajs/cluster)
* [recluster](https://github.com/doxout/recluster)
* [pm2](https://github.com/Unitech/pm2)