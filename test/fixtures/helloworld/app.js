const Koa = require('koa');
const cluster = require('cluster');

const app = new Koa();

app.use(ctx => {
  const id = ctx.query.id;
  ctx.body = 'Hello, World!: ' + cluster.worker.id + ':' + id;
  if (cluster.worker.id === 1) {
    process.exit(0);
    // throw new Error('server broken');
  }
});

module.exports = app;