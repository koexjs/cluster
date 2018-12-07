# koa-cluster

[![NPM version](https://img.shields.io/npm/v/@zcorky/koa-cluster.svg?style=flat)](https://www.npmjs.com/package/@zcorky/koa-cluster)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/koa-cluster.svg?style=flat)](https://coveralls.io/r/zcorky/koa-cluster)
[![Dependencies](https://david-dm.org/@zcorky/koa-cluster/status.svg)](https://david-dm.org/@zcorky/koa-cluster)
[![Build Status](https://travis-ci.com/zcorky/koa-cluster.svg?branch=master)](https://travis-ci.com/zcorky/koa-cluster)
![license](https://img.shields.io/github/license/zcorky/koa-cluster.svg)
[![issues](https://img.shields.io/github/issues/zcorky/koa-cluster.svg)](https://github.com/zcorky/koa-cluster/issues)

> Cluster for Koa

### Install

```
$ npm install @zcorky/koa-cluster
```

### Usage
* 1 command line
* 2 import { startApp } from 'koa-cluster';

```javascript
// app.js / app.ts
import * as Koa from 'koa';

const app = new Koa();

app.use(ctx => {
  ctx.body = 'hi, koa-cluster';
});

export default app;

// 1 command line
> koa-cluster app.js

// 2 code: server.js
import { startApp } from '@zcorky/koa-cluster';
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